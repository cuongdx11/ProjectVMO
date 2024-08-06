const nodemailer = require('nodemailer');
const User = require('../models/userModel');
const fs = require('fs');
const path = require('path');
const transporter = nodemailer.createTransport({
  service: 'gmail', // hoặc một dịch vụ email khác bạn sử dụng
  auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
  }
});

// const sendOrderConfirmationEmail = async (order,items,shippingCost) => {
//   try {
//     const user = await User.findByPk(order.user_id)
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: user.email,
//       subject: 'Xác nhận đơn hàng của bạn',
//       html: `
//         <h1>Cảm ơn bạn đã đặt hàng tại PShop!</h1>
//         <p>Mã đơn hàng của bạn là: <strong>${order.id}</strong></p>
//         <h2>Chi tiết đơn hàng:</h2>
//         <ul>
//           ${items.map(item => `
//             <li>${item.name} - Số lượng: ${item.quantity} - Giá: ${item.price} VND</li>
//           `).join('')}
//         </ul>
//         <p>Tổng tiền hàng: ${order.subtotal} VND</p>
//         <p>Phí vận chuyển: ${shippingCost} VND</p>
//         <p>Giảm giá: ${order.discount} VND</p>
//         <p><strong>Tổng cộng: ${order.total_amount} VND</strong></p>
//         <p>Trạng thái đơn hàng: ${order.status}</p>
//         <p>Chúng tôi sẽ thông báo cho bạn khi đơn hàng được gửi đi.</p>
//         <p>Cảm ơn bạn đã mua sắm tại PShop!</p>
//       `
//     };

//     const info = await transporter.sendMail(mailOptions);
//     console.log('Email sent: ' + info.response);
//   } catch (error) {
//     console.error('Error sending confirmation email:', error);
//   }
// };
const sendOrderConfirmationEmail = async (order, items, shippingCost) => {
  try {
    const user = await User.findByPk(order.user_id);
    const templatePath = path.join(__dirname, '../email-templates/orderConfirmationTemplate.html');
    const htmlTemplate = fs.readFileSync(templatePath, 'utf8');

    const itemsRows = items.map(item => `
      <tr>
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>${item.price.toLocaleString('vi-VN')} VND</td>
      </tr>
    `).join('');

    const htmlContent = htmlTemplate
      .replace('{{fullName}}', user.full_name)
      .replace('{{orderId}}', order.id)
      .replace('{{itemsRows}}', itemsRows)
      .replace('{{subtotal}}', order.subtotal.toLocaleString('vi-VN'))
      .replace('{{shippingCost}}', shippingCost.toLocaleString('vi-VN'))
      .replace('{{discount}}', order.discount.toLocaleString('vi-VN'))
      .replace('{{totalAmount}}', order.total_amount.toLocaleString('vi-VN'))
      .replace('{{status}}', order.status);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Xác nhận đơn hàng của bạn',
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
};

module.exports = { sendOrderConfirmationEmail };