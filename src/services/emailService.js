const nodemailer = require('nodemailer');
require('dotenv').config();
const transporter = nodemailer.createTransport({
    service: 'gmail', // hoặc một dịch vụ email khác bạn sử dụng
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendVerificationEmail = (email, token) => {
    const url = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Email Verification',
        html: `<p>Please verify your email by clicking the following link: <a href="${url}">${url}</a></p>`
    };

    return transporter.sendMail(mailOptions);
};

const sendMailForgotPass = (email,token) => {
    const url = `${process.env.CLIENT_URL}/reset-password?token=${token}`
    const mailOptions = {
        to: email,
        from: process.env.EMAIL_USER,
        subject: 'Đặt lại mật khẩu',
        text: `Bạn nhận được email này vì bạn (hoặc ai đó) đã yêu cầu đặt lại mật khẩu.
        \n\nVui lòng click vào link sau hoặc paste vào trình duyệt để hoàn tất quá trình:
        \n\n${url}
        \n\nNếu bạn không yêu cầu việc này, xin hãy bỏ qua email và mật khẩu của bạn sẽ không thay đổi.`
      };
    return transporter.sendMail(mailOptions);
}
module.exports = {
    sendVerificationEmail,
    sendMailForgotPass
};
