const Order = require("../models/orderModel");
const OrderItem = require('../models/orderItemModel')
const Voucher = require("../models/voucherModel");
const Item = require("../models/itemModel");
const { sequelize } = require('../config/dbConfig');
const { Op } = require('sequelize');
const ErrorRes = require('../helpers/ErrorRes')
const FlashSaleItem = require('../models/flashSaleItemModel')
const FlashSale = require('../models/flashSaleModel');
const ShippingAddress = require("../models/shippingAddressModel");
const Shipment = require('../models/shipmentModel')
const Payment = require('../models/paymentModel')
const OrderDiscount = require('../models/orderDiscountModel')
const {validateCheckoutData} = require('../helpers/validateCheckoutData')
const {calculateShippingCost} = require('../helpers/calculateShippingCost')
const {createPaymentUrlOrder} = require('../helpers/createPaymentUrlOrder')
const {OrderStatus,PaymentStatus,ShipmentStatus,PaymentMethodCT} = require('../constants/order')
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
          attributes: ['id','status']
        }
      ]
    })
    return {
      status: 'success',
      total: count,
      orders: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: +page,
    };
  } catch (error) {
    throw error
  }
}

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
          model: OrderDiscount,
          as: 'order_discounts',
          attributes:['discount_applied'],
          include:[
            {
              model: Voucher,
              as:'voucher',
              attributes:['code']
            }
          ]
        },
        {
          model: ShippingAddress,
          as: 'shipAddress',
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
        },
        {
          model: Shipment,
          as: 'shipment',
          attributes: ['tracking_number','status']
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
const createOrder = async(orderData) => {
  const transaction = await sequelize.transaction();
  try {
    const {creatorId, userId,items, discount, notes } = orderData;
    const [subtotal, updatedItems] = await calculateSubtotalAndUpdateStock(items, transaction);
    const totalAmount = subtotal  - discount;
    const order = await Order.create({
      user_id: userId,
      creator_id: creatorId,
      subtotal,
      total_amount: totalAmount,
      discount,
      status: OrderStatus.CONFIRMED,
      notes,
    }, { transaction });
    await createOrderItems(order.id, updatedItems, transaction);
    await transaction.commit();
    return {
      status : 'success',
      message: 'Tạo đơn hàng thành công',
      order: order
    }
  } catch (error) {
    await transaction.rollback();
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
      message: 'Thanh toán đơn hàng thành công',
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
  const now = new Date();
  const nowUTC = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  await Promise.all(items.map(async(item)=>{
    const [dbItem,flashSaleItem] = await Promise.all([
      Item.findByPk(item.item_id,{transaction}),
      FlashSaleItem.findOne(
        {
          where:{
          item_id:item.item_id
        },
        include: [{
          model: FlashSale,
          as:'flashSale',
          where: {
            start_time: { [Op.lte]: nowUTC },
            end_time: { [Op.gt]: nowUTC }
          }
        }],
          transaction
        })
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
    if(flashSaleItem) {
      await flashSaleItem.update({quantity : flashSaleItem.quantity -item.quantity,
        sold_quantity: flashSaleItem.sold_quantity + item.quantity },{transaction})
    }
    updatedItems.push({ ...item,name : name, price: priceSale });
    
  }))
  return [subtotal, updatedItems];
}
const getFlashSalePrice = async(flashSaleItem,regularPrice,transaction) => {
  if(!flashSaleItem) return regularPrice;
  const now = new Date();
  const flashSale = await FlashSale.findByPk(flashSaleItem.flash_sale_id)
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

const createPayment = async (orderId,paymentMethodId, amount, transaction) => {
  return Payment.create({
    order_id: orderId,
    payment_method_id: paymentMethodId,
    amount,
    currency: 'VND',
    status: 'pending',
  }, { transaction });
};
const createShippingAddress = async (orderData, transaction) => {
  return ShippingAddress.create({
    order_id: orderData.orderId,
    receiver_name: orderData.full_name,
    phone_number: orderData.phone_number,
    address_detail: orderData.address,
    ward: orderData.ward,
    district: orderData.district,
    province: orderData.province,
    country: 'Viet Nam',
  }, { transaction });
};

const createShipment = async (orderId,shippingMethodId, shippingCost,trackingNumber, transaction) => {
  return Shipment.create({
    order_id: orderId,
    shipping_method_id: shippingMethodId,
    shipping_cost: shippingCost,
    tracking_number: trackingNumber,
    status: 'pending',
  }, { transaction });
};

const createOrderCheckOut = async (userId, subtotal, totalAmount, discount, notes, transaction) => {
  return Order.create({
    user_id: userId,
    creator_id: userId,
    subtotal,
    total_amount: totalAmount,
    discount,
    status: OrderStatus.PENDING,
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

const createOrderByUser = async(userId,orderData) =>{
  const validationErrors = validateCheckoutData(orderData);
  if (validationErrors.length > 0) {
    throw new ErrorRes(400, validationErrors);
  }

  const transaction = await sequelize.transaction();
  try {
    const { items, voucher_code, notes, paymentMethodId, shippingMethodId,shippingCost } = orderData;

    const [subtotal, updatedItems] = await calculateSubtotalAndUpdateStock(items, transaction);
    
    // const shippingCost = await calculateShippingCost(shippingAddress);
    let discount = 0
    if(voucher_code) {
      discount = await applyDiscount(voucher_code, subtotal, transaction);
    }
    

    const totalAmount = subtotal + shippingCost - discount;
    const order = await createOrderCheckOut(userId,subtotal, totalAmount, discount, notes, transaction);
    orderData.orderId = order.id
    const shippingAddress = await createShippingAddress(orderData, transaction);
    const payment = await createPayment(order.id,paymentMethodId, totalAmount, transaction);
    const trackingNumber = 'VMO'+ payment.id
    const shipment = await createShipment(order.id,shippingMethodId, shippingCost,trackingNumber, transaction);
    

    await createOrderItems(order.id, updatedItems, transaction);
    if(voucher_code){
      await createOrderDiscount(order.id,voucher_code,discount,transaction);
    }

    await redisClient.publish('notifications',JSON.stringify({
      type: 'ORDER',
      message: `Đơn hàng ${order.id} được mua bởi khách hàng `,
      related_id: order.id,
      userId : userId

    }))

    await emailQueue.add('order-confirmation', {
      orderId: order.id,
      items: updatedItems,
      shippingCost: shippingCost
    });
    await transaction.commit();
   
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

const updateStatusOrder = async (orderId, newStatus) => {
  const transaction = await sequelize.transaction();
  try {
    const order = await Order.findByPk(orderId, {
      include: { model: Payment, as: 'payment' },
      transaction
    });

    if (!order) {
      throw new ErrorRes(404, 'Không có đơn hàng');
    }

    if (order.status !== newStatus) {
      await order.update({ status: newStatus }, { transaction });

      if (newStatus === OrderStatus.CONFIRMED) {
        await handleConfirmedOrder(order, transaction);
        await redisClient.publish('userNotifications',JSON.stringify({
          type: 'ORDER',
          content: `Đơn hàng ${order.id} của bạn đã được xác nhận `,
          userId : order.user_id
    
        }))
      } 
    }

    await transaction.commit();
    return { message: 'Cập nhật thành công trạng thái đơn hàng' };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const updateStatusShipment = async (orderId, newStatus) => {
  const transaction = await sequelize.transaction();
  try {
    const order = await Order.findByPk(orderId, {
      include: { model: Shipment, as: 'shipment' },
      transaction
    });

    if (!order) {
      throw new ErrorRes(404, 'Không có đơn hàng');
    }

    const shipment = order.shipment;

    if (!shipment) {
      throw new ErrorRes(404, 'Không có giao hàng');
    }

    if (shipment.status !== newStatus) {
      await shipment.update({ status: newStatus }, { transaction });

      if (newStatus === ShipmentStatus.SHIPPED) {
        await updateStatusOrder(orderId, OrderStatus.PROCESSING, transaction);
        await redisClient.publish('userNotifications',JSON.stringify({
          type: 'ORDER',
          content: `Đơn hàng ${order.id} của bạn đang được giao tới bạn`,
          userId : order.user_id
    
        }))
      }
      if (newStatus === ShipmentStatus.DELIVERED) {
        await shipment.update({delivered_at: new Date() },{transaction})
        await handleDeliveredShipment(order, transaction);
        await redisClient.publish('userNotifications',JSON.stringify({
          type: 'ORDER',
          content: `Đơn hàng ${order.id} của bạn được giao thành công`,
          userId : order.user_id
    
        }))
      }
    }

    await transaction.commit();
    return { message: 'Cập nhật thành công trạng thái giao hàng' };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const handleConfirmedOrder = async (order, transaction) => {
  const payment = await Payment.findByPk(order.payment_id, { transaction });

  if (!payment) {
    throw new ErrorRes(404, 'Không có thanh toán');
  }

  if (payment.payment_method_id === PaymentMethodCT.COD ||
    (payment.payment_method_id === PaymentMethodCT.VN_PAY && payment.status === PaymentStatus.COMPLETED)) {
    await updateStatusShipment(order.id, ShipmentStatus.PROCESSING);
  } else if (payment.payment_method_id === PaymentMethodCT.VN_PAY && payment.status === PaymentStatus.PENDING) {
    throw new ErrorRes(400, 'Khách hàng chưa thanh toán');
  }
};

const handleDeliveredShipment = async (order, transaction) => {
  const payment = await Payment.findByPk(order.payment_id, { transaction });

  if (payment && payment.payment_method_id === PaymentMethodCT.COD) {
    payment.status = PaymentStatus.COMPLETED;
    await payment.save({ transaction });
  }

  await updateStatusOrder(order.id, OrderStatus.COMPLETED, transaction);
};


module.exports = {
  createOrder,
  getOrderById,
  updateOrder,
  deleteOrder,
  cancelOrder,
  payOrder,
  applyVoucher,
  getOrders,
  updateStatusOrder,
  updateStatusShipment,
  createOrderByUser

};
