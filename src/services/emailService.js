const nodemailer = require('nodemailer');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const transporter = nodemailer.createTransport({
    service: 'gmail', // hoặc một dịch vụ email khác bạn sử dụng
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendVerificationEmail = (email, token) => {
    const url = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
    const templatePath = path.join(__dirname, '../email-templates/verificationEmailTemplate.html');
    const htmlTemplate = fs.readFileSync(templatePath, 'utf8');

    const htmlContent = htmlTemplate.replace(/{{url}}/g, url);

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Xác minh địa chỉ email',
        html: htmlContent
    };

    return transporter.sendMail(mailOptions);
};
const sendInvitationEmail = (email, fullName, token, nameRole) => {
    const url = `${process.env.CLIENT_URL}/verify-invitation-email/${token}`;
    const templatePath = path.join(__dirname, '../email-templates/invitationTemplate.html');
    const htmlTemplate = fs.readFileSync(templatePath, 'utf8');

    const htmlContent = htmlTemplate
        .replace('{{fullName}}', fullName)
        .replace('{{nameRole}}', nameRole)
        .replace(/{{url}}/g, url);

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Lời mời tham gia quản lý PShop',
        html: htmlContent
    };

    return transporter.sendMail(mailOptions);
};

const sendInformationLogin = async(fullName,email,password) => {
    const urlLogin = `${process.env.CLIENT_URL}/login`
    const templatePath = path.join(__dirname, '../email-templates/sendInformationLogin.html');
    const htmlTemplate = fs.readFileSync(templatePath, 'utf8');
    const htmlContent = htmlTemplate
        .replace('{{fullName}}', fullName)
        .replace(/{{urlLogin}}/g, urlLogin)
        .replace('{{email}}', email)
        .replace('{{password}}', password);
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Thông tin đăng nhập PShop',
        html: htmlContent
    }
    return transporter.sendMail(mailOptions);
}

const sendMailForgotPass = (email, token) => {
    const url = `${process.env.CLIENT_URL}/reset-password/${token}`;
    const templatePath = path.join(__dirname, '../email-templates/forgotPasswordTemplate.html');
    const htmlTemplate = fs.readFileSync(templatePath, 'utf8');

    const htmlContent = htmlTemplate
        .replace(/{{url}}/g, url);

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Đặt lại mật khẩu',
        html: htmlContent
    };

    return transporter.sendMail(mailOptions);
};
module.exports = {
    sendVerificationEmail,
    sendMailForgotPass,
    sendInvitationEmail,
    sendInformationLogin
};
