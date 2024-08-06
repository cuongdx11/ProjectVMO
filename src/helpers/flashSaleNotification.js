const cron = require('node-cron')
const {Op} = require('sequelize')
const FlashSale = require('../models/flashSaleModel')
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer')
const NotificationFlashSale = require('../models/notificationFlashSaleModel')
const User = require('../models/userModel')
require('dotenv').config();
const transporter = nodemailer.createTransport({
    service: 'gmail', // hoặc một dịch vụ email khác bạn sử dụng
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendMailFlashSale = async (flashSale) => {
    try {
        const notificationFlashSale = await NotificationFlashSale.findOne({
            where: {
                flash_sale_id: flashSale.id
            }
        });

        if (notificationFlashSale.is_send === 1) {
            return {
                message: 'Thông báo đã được gửi rồi'
            };
        }

        const users = await User.findAll({
            where: {
                is_notification: 1
            }
        });

        const userEmails = users.map(user => user.email);
        const templatePath = path.join(__dirname, '../email-templates/flashSaleNotifications.html');
        const htmlTemplate = fs.readFileSync(templatePath, 'utf8');

        const htmlContent = htmlTemplate.replace(/{{flashSaleName}}/g, flashSale.name);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            bcc: userEmails.join(','),
            subject: `Flash Sale "${flashSale.name}" sắp bắt đầu!`,
            html: htmlContent
        };

        await transporter.sendMail(mailOptions);

        await NotificationFlashSale.update({ is_send: 1 }, {
            where: {
                flash_sale_id: flashSale.id
            }
        });

        return {
            message: 'Thông báo flash sale đã được gửi thành công.'
        };
    } catch (error) {
        throw error;
    }
};

const checkFlashSale = async() => {
    try {
        const now = new Date()
        const nowUTC = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
        const fifteenMinutesLater = new Date(nowUTC.getTime() + 15 * 60 * 1000);
        const notificationsFlashSale = await NotificationFlashSale.findAll({
            where:{
                scheduled_time : {
                    // [Op.lte] : nowUTC,
                    // [Op.lt]: fifteenMinutesLater,
                    [Op.between] : [nowUTC,fifteenMinutesLater]
                },
                is_sent : false
            },
            include: [{
                model: FlashSale,
                where: {
                    status: 'preparing'
                }
            }]
        })
        for(let notification of notificationsFlashSale){
            if(notification.is_send === false){
                await sendMailFlashSale(notification.FlashSale)
                console.log('Da gui mail')
                notification.is_sent = true
                await notification.save()
            }  
        }
    } catch (error) {
        throw error
    }
}

const runJob = () => {
    cron.schedule('* * * * *', checkFlashSale); // Chạy mỗi 10 giây
    console.log('Flash sale notification job started');
}
module.exports = {
    runJob,
    checkFlashSale,
    sendMailFlashSale

}
