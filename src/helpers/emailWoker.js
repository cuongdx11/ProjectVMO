const Queue = require('bull');
const redisClient = require('../config/redisConfig');
const  Order  = require('../models/orderModel');
const {sendOrderConfirmationEmail} = require('../helpers/sendOrderConfirmationEmail')
const emailService = require('../services/emailService')
const emailQueue = new Queue('email-queue', { redis: redisClient });

emailQueue.process('order-confirmation', async (job) => {
  try {
    const { orderId, items, shippingCost } = job.data;
    const order = await Order.findByPk(orderId);
    if (!order) {
      throw new Error(`Không tìm thấy đơn hàng với id ${orderId}`);
    }
    await sendOrderConfirmationEmail(order, items, shippingCost);
    console.log(`Đã gửi email xác nhận cho đơn hàng ${orderId}`);
  } catch (error) {
    console.error(`Lỗi khi xử lý đơn hàng ${job.data.orderId}:`, error);
    throw error; // Ném lỗi để Bull biết job đã thất bại
  }
});

emailQueue.process('verify-email',async(job) => {
  try {
      const { email, verificationToken } = job.data;
      await emailService.sendVerificationEmail(email,verificationToken)
      console.log(`Đã gửi email xác nhận cho email ${email}`)
  } catch (error) {
    throw error
  }
})

// Xử lý sự kiện completed
emailQueue.on('completed', (job) => {
  console.log(`Job ${job.id} đã hoàn thành thành công`);
});

// Xử lý sự kiện failed
emailQueue.on('failed', (job, error) => {
  console.error(`Job ${job.id} thất bại:`, error);
});

// Xử lý sự kiện error của queue
emailQueue.on('error', (error) => {
  console.error('Lỗi queue:', error);
});

// Xử lý lỗi không bắt được
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

console.log('Email worker đang chạy');