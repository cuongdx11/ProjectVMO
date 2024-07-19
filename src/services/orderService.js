const { where } = require("sequelize");
const Order = require("../models/orderModel");
const OrderItem = require('../models/orderitemModel')
const Voucher = require("../models/voucherModel");
const Item = require("../models/itemModel");
const { sequelize } = require('../config/dbConfig');
const { Op } = require('sequelize');
const ErrorRes = require('../helpers/ErrorRes')
const FlashSaleItem = require('../models/flashsaleitemModel')
const FlashSale = require('../models/flashsaleModel');
const ShippingAddress = require("../models/shippingAddressModel");
const Shipment = require('../models/shipmentModel')
const Payment = require('../models/paymentModel')
const OrderDiscount = require('../models/orderDiscountModel')
const {validateCheckoutData} = require('../helpers/validateCheckoutData')
const {calculateShippingCost} = require('../helpers/calculateShippingCost')
const {createPaymentUrlOrder} = require('../helpers/createPaymentUrlOrder')
const {sendOrderConfirmationEmail} = require('../helpers/sendOrderConfirmationEmail')
const {createNotification} = require('../services/notificationService');
const redisClient = require('../config/redisConfig');
const User = require("../models/userModel");
const Queue = require('bull');
const PaymentMethod = require("../models/paymentMethodModel");
const emailQueue = new Queue('email-queue', {
  redis: redisClient
});

const getOrders = async({
  page = 1,
  sortBy = null,
  filter = null,
  order = null,
  pageSize = null,
  search = null,
  ...query
}) => {
  try {
    const offset = page <=1 ? 0 : page -1
    const limit = +pageSize || +process.env.LIMIT||10
    const queries = {
      raw: false,
      nest: true,
      limit: limit,
      offset: offset*limit
    }
    let sequelizeOrder = [];
    if (sortBy && order) {
      const orderDirection = order.toUpperCase() || 'asc'
      sequelizeOrder.push([sortBy, orderDirection]);
      queries.order = sequelizeOrder;
    }
    
    if (search) query.name = { [Op.substring]: search };
    
    const where = {...query}

    if (filter && typeof filter === "object") {
      Object.entries(filter).forEach(([key,value])=>{
        if(value !== null && value !== undefined){
          where[key] = value
        }
      })
    }
    const {count,rows} = await Order.findAndCountAll({
      where,
      ...queries,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['full_name']
        },
        {
          model: Payment,
          as: 'payment',
          attributes: ['status']
        }
      ]
    })
    return {
      status: 'success',
      total: count,
      items: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: +page,
    };
  } catch (error) {
    
  }
}
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
      let priceSale = dbitem.selling_price
      if (flashSaleItem) {
          const now = new Date()
          const flashSale = await FlashSale.findByPk(flashSaleItem.flash_sale_id,{ transaction: t }) 
          if (flashSale && now >= flashSale.start_time && now <= flashSale.end_time) {
              priceSale = flashSaleItem.flash_sale_price;
          }
      }

      
      if(dbitem.stock_quantity < item.quantity){
        await t.rollback();
        throw new ErrorRes(400,'Sản phẩm không đủ số lượng')
      }
      total_amount += priceSale * item.quantity;

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
      const itemdb = await Item.findByPk(item.item_id)
      let priceSale = itemdb.selling_price
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
    const order = await Order.findOne({
      where: { id: id },
      attributes: {
        exclude: ['created_at', 'updated_at']
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['full_name','email','phone']
        },
        {
          model: OrderItem,
          as: 'order_items',
          attributes:['quantity','price'],
          include: [
            {
              model:Item,
              as:'item',
              attributes:['id','name','thumbnail']
            }
          ]
        },
        {
          model: ShippingAddress,
          as: 'address_ship',
          attributes: ['receiver_name','phone_number','address_detail','ward','district','province','country']
        },
        {
          model: Payment,
          as: 'payment',
          attributes: ['amount','currency','status','paid_at'],
          include: [
            {
              model: PaymentMethod,
              as: 'payment_method',
              attributes: ['name', 'description']
            }
          ]
        }
      ],
    })
    // const orderItem = await OrderItem.findAll({
    //   where: {order_id: id}
    // })
    if(!order){
      throw new ErrorRes(404,'Đơn hàng không tồn tại')
    }
    return {
      status : 'success',
      message: 'Lấy đơn hàng thành công',
      order: order,
      // orderItem: orderItem
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
const cancelOrder = async(id) => {
  try {
    const order = await Order.findByPk(id)
    if(!order){
      throw new ErrorRes(404,'Đơn hàng không tồn tại')
    }
    if(order.status == 'completed'){
      throw new ErrorRes(400,'Đơn hàng đã được hoàn thành,không thể hủy')
    }
    if(order.status == 'cancelled'){
      throw new ErrorRes(400,'Đơn hàng đã bị hủy,không thể hủy lại')
    }
    const orderItem = await OrderItem.findAll({
      where: {order_id: id}
    })
    for (let i = 0; i < orderItem.length; i++) {
      const orderItemData = orderItem[i]
      const item = await Item.findByPk(orderItemData.item_id)
      item.stock_quantity += orderItemData.quantity
      await item.save()
    }
    order.status = 'cancelled'
    await order.save()
    return {
      status : 'success',
      message: 'Hủy đơn hàng thành công',
    }
  } catch (error) {
    throw(error)
  }
}
const payOrder = async(id,code,tran_code) => {
  try {
    if(code == '00'){
      const order = await Order.findByPk(id)
      if(!order){
        throw new ErrorRes(404,'Đơn hàng không tồn tại')
      }
      order.payment_status = 'paid'
      // order.status = 'processing'
      await order.save()
      const payment = await Payment.findByPk(order.payment_id)
      if(!payment){
        throw new ErrorRes(404,'Thanh toán không tồn tại')
      }
      payment.transaction_id = tran_code
      await payment.save()
    }
   
    return {
      status : 'success',
      message: 'Thanh toán đơn hàng thành công'
    }
  } catch (error) {
    throw error
  }
}
const applyVoucher = async(orderData) =>{
  try {
    const {total_amount,voucher_code} = orderData
    const voucher = await Voucher.findOne({
      where: {code: voucher_code}
    })
    if(!voucher){
      throw new ErrorRes(404,'Mã giảm giá không tồn tại')
    }
    if(voucher.end_date < new Date()){
      throw new ErrorRes(400,'Mã giảm giá đã hết hạn')
    }
    if(voucher.remaining_quantity <= 0){
      throw new ErrorRes(400,'Mã giảm giá đã hết số lượng')
    }
    voucher.remaining_quantity -= 1
    await voucher.save()
    let discountAmount
    if(voucher.discount_type == 'fixed'){
      discountAmount = voucher.discount_amount
    }
    if(voucher.discount_type == 'percentage'){
      discountAmount = (total_amount * (voucher.discount / 100));
    }
    const finalTotal = total_amount - discountAmount;

    return {
      status : 'success',
      message: 'Áp dụng mã giảm giá thành công',
      voucher: voucher,
      finalTotal: finalTotal,
      discountAmount: discountAmount
    }
  } catch (error) {
    throw error
  }
}
const calculateSubtotalAndUpdateStock =async(items,transaction) => {
  let subtotal = 0;
  const updatedItems = [];
  await Promise.all(items.map(async(item)=>{
    const [dbItem,flashSaleItem] = await Promise.all([
      Item.findByPk(item.item_id,{transaction}),
      FlashSaleItem.findOne({where:{item_id:item.item_id},transaction})
    ])
    if(!dbItem){
      throw new ErrorRes(404,'Sản phẩm không tồn tại')
    }
    if (dbItem.stock_quantity < item.quantity) {
      throw new ErrorRes(400, 'Sản phẩm không đủ số lượng');
    }
    const priceSale = await getFlashSalePrice(flashSaleItem,dbItem.selling_price,transaction)
    subtotal += priceSale * item.quantity;
    const name = dbItem.name
    await dbItem.update({ stock_quantity: dbItem.stock_quantity - item.quantity }, { transaction });
    updatedItems.push({ ...item,name : name, price: priceSale });
    
  }))
  return [subtotal, updatedItems];
}
const getFlashSalePrice = async(flashSaleItem,regularPrice,transaction) => {
  if(!flashSaleItem) return regularPrice;
  const now = new Date();
  const flashSale = await FlashSale.findByPk(flashSaleItem.flash_sale_id, { transaction });
  if (flashSale && now >= flashSale.start_time && now <= flashSale.end_time) {
    return flashSaleItem.flash_sale_price;
  }
  return regularPrice;
}

const applyDiscount = async (voucherCode, subtotal, transaction) => {
  if (!voucherCode) return 0;

  const voucher = await Voucher.findOne({ where: { code: voucherCode }, transaction });
  if (!voucher) {
    throw new ErrorRes(400, 'Mã giảm giá không tồn tại');
  }
  if (voucher.remaining_quantity <= 0) {
    throw new ErrorRes(400, 'Mã giảm giá đã hết');
  }
  if (voucher.expired_date < new Date()) {
    throw new ErrorRes(400, 'Mã giảm giá đã hết hạn');
  }

  const discount = voucher.discount_type === 'percentage'
    ? subtotal * voucher.discount_amount / 100
    : +voucher.discount_amount;

  await voucher.update({ remaining_quantity: voucher.remaining_quantity - 1 }, { transaction });

  return discount;
};

const createPayment = async (paymentMethodId, amount, transaction) => {
  return Payment.create({
    payment_method_id: paymentMethodId,
    amount,
    currency: 'VND',
    status: 'pending',
  }, { transaction });
};
const createShippingAddress = async (orderData, transaction) => {
  return ShippingAddress.create({
    receiver_name: orderData.full_name,
    phone_number: orderData.phone_number,
    address_detail: orderData.address,
    ward: orderData.ward,
    district: orderData.district,
    province: orderData.province,
    country: 'Viet Nam',
  }, { transaction });
};
const createShipment = async (shippingMethodId, shippingCost, transaction) => {
  return Shipment.create({
    shipping_method_id: shippingMethodId,
    shipping_cost: shippingCost,
    status: 'pending',
  }, { transaction });
};

const createOrderCheckOut = async (userId, shippingAddressId, paymentId, shipmentId, subtotal, totalAmount, discount, notes, transaction) => {
  return Order.create({
    user_id: userId,
    shipping_address_id: shippingAddressId,
    payment_id: paymentId,
    shipment_id: shipmentId,
    subtotal,
    total_amount: totalAmount,
    discount,
    status: 'pending',
    payment_status: 'unpaid',
    notes,
  }, { transaction });
};

const createOrderItems = async (orderId, items, transaction) => {
  const orderItems = items.map(item => ({
    order_id: orderId,
    item_id: item.item_id,
    quantity: item.quantity,
    price: item.price,
  }));

  return OrderItem.bulkCreate(orderItems, { transaction });
};
const createOrderDiscount = async(orderId,voucher_code,discount,transaction) => {
  const voucher = await Voucher.findOne({
    where: { code: voucher_code }
  })
  if(!voucher) {
    throw new ErrorRes(404,'Mã khuyến mãi không tồn tại')

  }
  const orderDiscount = await OrderDiscount.create({
    order_id : orderId,
    voucher_id : voucher.id,
    discount_applied : discount

  },{ transaction })
  return orderDiscount
}

const checkOut = async(orderData) =>{
  const validationErrors = validateCheckoutData(orderData);
  if (validationErrors.length > 0) {
    throw new ErrorRes(400, validationErrors);
  }

  const transaction = await sequelize.transaction();
  try {
    const { items, userId, voucher_code, notes, paymentMethodId, shippingMethodId } = orderData;

    const [subtotal, updatedItems] = await calculateSubtotalAndUpdateStock(items, transaction);
    const shippingAddress = await createShippingAddress(orderData, transaction);
    const shippingCost = await calculateShippingCost(shippingAddress);
    const discount = await applyDiscount(voucher_code, subtotal, transaction);

    const totalAmount = subtotal + shippingCost - discount;

    const payment = await createPayment(paymentMethodId, totalAmount, transaction);
    const shipment = await createShipment(shippingMethodId, shippingCost, transaction);
    const order = await createOrderCheckOut(userId, shippingAddress.id, payment.id, shipment.id, subtotal, totalAmount, discount, notes, transaction);

    await createOrderItems(order.id, updatedItems, transaction);
    await createOrderDiscount(order.id,voucher_code,discount,transaction);
    // const userBuy = await User.findByPk(userId)
    // await createNotification(`Đơn hàng ${order.id} được mua bởi khách hàng ${userBuy.full_name}`,'NEW_ORDER')
    await transaction.commit();
    // await sendOrderConfirmationEmail(order,updatedItems,shippingCost)
    await emailQueue.add('order-confirmation', {
      orderId: order.id,
      items: updatedItems,
      shippingCost: shippingCost
  });
    if (paymentMethodId === 2) {
      const vnpayUrl = await createPaymentUrlOrder(order.id,totalAmount,'NCB')
      return { order, paymentUrl: vnpayUrl };
    }
    
    
    return order
  } catch (error) {
    await transaction.rollback();
    throw new ErrorRes(error.statusCode || 500, error.message);
  }
}

module.exports = {
  createOrder,
  getOrderById,
  updateOrder,
  deleteOrder,
  cancelOrder,
  payOrder,
  applyVoucher,
  checkOut,
  getOrders

};
