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
const sendInvitationEmail = (email,fullName,token,nameRole) => {
    const url = `${process.env.CLIENT_URL}/verify-invitation-email/${token}`;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Lời mời tham gia quản lý PShop',
        html: `<p>Thân gửi anh/chị ${fullName},</p>,
               <p>Anh/chị được mời tham gia web <strong>Pshop</strong> với vai trò là <strong>${nameRole}</strong>.</p>
               <p>Anh/chị vui lòng truy cập đường dẫn <a href="${url}">${url}</a> để xác nhận tham gia.</p>
               <p>Nếu anh/chị không làm việc tại <strong>Pshop</strong>, vui lòng bỏ qua email này. </p>
               <p>Anh/chị cần hỗ trợ bất cứ gì hãy liên hệ cho chúng tôi với email: <a href="mailto:Support@sapo.vn">pshoptech@gmail.com </a></p>
               <p>Cảm ơn anh/chị đã quan tâm đến Pshop.</p>
               <p>Trân trọng</p>
               <p>Đội ngũ Pshop</p>
        `
    }
    return transporter.sendMail(mailOptions);
}

const sendInformationLogin = async(fullName,email,password) => {
    const urlLogin = `${process.env.CLIENT_URL}/login`
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Thông tin đăng nhập PShop',
        html: `<p>Thân gửi anh/chị ${fullName},</p>
        <p>Chào mừng anh/chị đã đến với <strong>Pshop</strong> </p>
        <p>Anh/chị có thể đăng nhâp và cập nhật thông tin của mình bằng cách truy nhập vào <a href="${urlLogin}">${urlLogin}</a> </p>
        <p>Thông tin đăng nhập của anh/chị như sau:</p>
        <p>Email: ${email}</p>
        <p>Mật khẩu: ${password}</p>
        <p>Nếu anh/chị quên mật khẩu vui lòng liên hệ với chúng tôi để </p>
        <p>Cảm ơn anh/chị đã quan tâm đến Pshop.</p>
        <p>Trân trọng,</p>
        <p>Đội ngũ Pshop</p>
        `
    }
    return transporter.sendMail(mailOptions);
}

const sendMailForgotPass = (email,token) => {
    const url = `${process.env.CLIENT_URL}/reset-password/${token}`
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
    sendMailForgotPass,
    sendInvitationEmail,
    sendInformationLogin
};
