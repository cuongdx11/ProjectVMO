const { where } = require("sequelize");
const Order = require("../models/orderModel");
const OrderItem = require('../models/orderitemModel')
const Voucher = require("../models/voucherModel");
const Item = require("../models/itemModel");
const { sequelize } = require('../config/dbConfig');
const { Op } = require('sequelize');
const ErrorRes = require('../helpers/ErrorRes')
const FlashSaleItem = require('../models/flashsaleitemModel')
const FlashSale = require('../models/flashsaleModel')

const createOrder = async (user_id, items, voucher_code) => {
  const t = await sequelize.transaction();
  try {
    let voucher = null;
    if (voucher_code) {
      voucher = await Voucher.findOne({
        where: {
          code: voucher_code,
          start_date: { [Op.lte]: new Date() },
          end_date: { [Op.gte]: new Date() },
          remaining_quantity: { [Op.gt]: 0 },
        },
      });
    }
    // if (!voucher) {
    //   throw new Error("Voucher không hợp lệ hoặc đã hết hạn");
    // }
    let total_amount = 0;
    for (let item of items) {
      const dbitem = await Item.findByPk(item.item_id, { transaction: t });
      if (!dbitem) {
        await t.rollback();
        throw new ErrorRes(404,'Sản phẩm không tồn tại')
      }
      const flashSaleItem = await FlashSaleItem.findOne({
        where: { item_id: item.item_id }
        
      },{ transaction: t })
      let priceSale = item.selling_price
      if (flashSaleItem) {
          const now = new Date()
          const flashSale = await FlashSale.findByPk(flashSaleItem.flash_sale_id,{ transaction: t }) 
          if (flashSale && now >= flashSale.start_time && now <= flashSale.end_time) {
              priceSale = flashSaleItem.flash_sale_price;
          }
      }
      dbitem.selling_price = priceSale
      if(dbitem.stock_quantity < item.quantity){
        await t.rollback();
        throw new ErrorRes(400,'Sản phẩm không đủ số lượng')
      }
      total_amount += dbitem.selling_price * item.quantity;

      // Trừ số lượng tồn kho
      await dbitem.update(
        {
          stock_quantity: dbitem.stock_quantity - item.quantity,
        },
        { transaction: t }
      );
    }
    // Áp dụng giảm giá nếu có voucher
    if (voucher) {
      if (voucher.discount_type === "percentage") {
        total_amount *= 1 - voucher.discount_amount / 100;
      } else {
        total_amount = Math.max(0, total_amount - voucher.discount_amount);
      }

      // Giảm số lượng voucher còn lại
      await voucher.update(
        {
          remaining_quantity: voucher.remaining_quantity - 1,
        },
        { transaction: t }
      );
    }
    // Tạo đơn hàng
    const order = await Order.create(
      {
        user_id,
        voucher_id: voucher ? voucher.id : null,
        total_amount,
        status: "pending",
      },
      { transaction: t }
    );
    // Tạo chi tiết đơn hàng
    for (const item of items) {
      const flashSaleItem = await FlashSaleItem.findOne({
        where: { item_id: item.item_id }
        
      },{ transaction: t })
      let priceSale = item.selling_price
      if (flashSaleItem) {
          const now = new Date()
          const flashSale = await FlashSale.findByPk(flashSaleItem.flash_sale_id,{ transaction: t }) 
          if (flashSale && now >= flashSale.start_time && now <= flashSale.end_time) {
              priceSale = flashSaleItem.flash_sale_price;
          }
      }
      await OrderItem.create(
        {
          order_id: order.id,
          item_id: item.item_id,
          quantity: item.quantity,
          price: priceSale,
        },
        { transaction: t }
      );
    }
    await t.commit();
    return {
      message: 'Đơn hàng đã được tạo thành công',
      order: {
        id: order.id,
        total_amount: order.total_amount,
        status: order.status,
        items: items,
      },
    };
  } catch (error) {
    throw error;
  }
};
const getOrderById = async(id) => {
  try {
    const order = await Order.findByPk(id)
    const orderItem = await OrderItem.findAll({
      where: {order_id: id}
    })
    if(!order){
      throw new ErrorRes(404,'Đơn hàng không tồn tại')
    }
    return {
      status : 'success',
      message: 'Lấy đơn hàng thành công',
      order: order,
      orderItem: orderItem
    }
  } catch (error) {
    throw error
  }
}
const updateOrder = async(id,orderData) => {
  try {
    const order = await Order.findByPk(id)
    if(!order){
      throw new ErrorRes(404,'Đơn hàng không tồn tại')
    }
    const updateOrder = await order.update(orderData)
    return {
      status : 'success',
      message: 'Cập nhật đơn hàng thành công',
      data: updateOrder
    }
  } catch (error) {
    throw error
  }
}
const deleteOrder = async(id) => {
  try {
    const order = await Order.findByPk(id)
    if(!order){
      throw new ErrorRes(404,'Đơn hàng không tồn tại')
    }
    await order.destroy()
    return {
      status : 'success',
      message: 'Xóa đơn hàng thành công',
    }
  } catch (error) {
    throw error
  }
}

module.exports = {
  createOrder,
  getOrderById,
  updateOrder,
  deleteOrder
};
