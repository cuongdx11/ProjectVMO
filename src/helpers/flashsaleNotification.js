const cron = require('node-cron')
const {Op} = require('sequelize')
const FlashSale = require('../models/flashsaleModel')
const nodemailer = require('nodemailer')
const moment = require('moment');
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

const sendMailFlashSale = async(flashSale) => {
    try {
        const users = await User.findAll({
            where : {
                is_notification : 1
            }
        });
        const userEmails = users.map(user => user.email)
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmails.join(','),
            subject: `Flash Sale "${flashSale.name}" sắp bắt đầu!`,
            text: `Flash Sale "${flashSale.name}" sẽ bắt đầu sau 15 phút. Đừng bỏ lỡ!`,
            html: `<b>Flash Sale "${flashSale.name}" sẽ bắt đầu sau 15 phút. Đừng bỏ lỡ!</b>`
        };
        return transporter.sendMail(mailOptions);
    } catch (error) {
        throw error
    }
}

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
            await sendMailFlashSale(notification.FlashSale)
            console.log('Da gui mail')
            notification.is_sent = true
            await notification.save()
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