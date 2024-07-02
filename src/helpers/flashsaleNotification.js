const cron = require('node-cron')
const {Op} = require('sequelize')
const FlashSale = require('../models/flashsaleModel')
const nodemailer = require('nodemailer')
const moment = require('moment');
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
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL,
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
        const now = new Date();
        const nowUTC = new Date(now.getTime() - now.getTimezoneOffset() * 60000); // Chuyển đổi sang UTC để thống nhất
        //Tính toán khung thời gian 15 phút tới theo UTC
        const fifteenMinutesLater = new Date(nowUTC.getTime() + 15 * 60000);
        // console.log(nowUTC)
        // console.log(fifteenMinutesLater)
        const upcomingFlashSales = await FlashSale.findAll({
            where: {
                start_time: {
                    [Op.between]: [now, fifteenMinutesLater]
                },
                status: 'preparing'
            }
        });
        for (let flashSale of upcomingFlashSales) {
            await sendMailFlashSale(flashSale);
        }
    } catch (error) {
        throw error
    }
}

const runJob = () => {
    cron.schedule('* * * * *', checkFlashSale);
    console.log('Flash sale notification job started');
}
module.exports = {
    runJob
}