// utils/emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  // Cấu hình SMTP của bạn ở đây
  host: 'smtp.example.com',
  port: 587,
  secure: false,
  auth: {
    user: 'your_email@example.com',
    pass: 'your_password'
  }
});

const sendOrderConfirmationEmail = async (order) => {
  try {
    // Lấy thông tin chi tiết về đơn hàng
    const orderDetails = await order.getFullDetails(); // Giả sử bạn có method này

    const mailOptions = {
      from: '"SammiShop" <noreply@sammishop.com>',
      to: orderDetails.user.email,
      subject: 'Xác nhận đơn hàng của bạn',
      html: `
        <h1>Cảm ơn bạn đã đặt hàng tại SammiShop!</h1>
        <p>Mã đơn hàng của bạn là: <strong>${order.id}</strong></p>
        <h2>Chi tiết đơn hàng:</h2>
        <ul>
          ${orderDetails.items.map(item => `
            <li>${item.name} - Số lượng: ${item.quantity} - Giá: ${item.price} VND</li>
          `).join('')}
        </ul>
        <p>Tổng tiền hàng: ${order.subtotal} VND</p>
        <p>Phí vận chuyển: ${order.shipping_cost} VND</p>
        <p>Giảm giá: ${order.discount} VND</p>
        <p><strong>Tổng cộng: ${order.total_amount} VND</strong></p>
        <p>Trạng thái đơn hàng: ${order.status}</p>
        <p>Chúng tôi sẽ thông báo cho bạn khi đơn hàng được gửi đi.</p>
        <p>Cảm ơn bạn đã mua sắm tại SammiShop!</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
};

module.exports = { sendOrderConfirmationEmail };