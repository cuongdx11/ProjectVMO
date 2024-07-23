const FlashSale = require('../models/flashSaleModel')
const cron = require('node-cron');
const { Op } = require('sequelize');
require('dotenv').config();

const updateFlashSaleStatus = async() => {
    try {
        const now = new Date()
        const nowUTC = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
        await FlashSale.update(
            { status: 'active' },
            {
                where: {
                    start_time: {
                        [Op.lte]: nowUTC
                    },
                    status: 'preparing'
                }
            }
        );

        await FlashSale.update(
            { status: 'ended' },
            {
                where: {
                    end_time: {
                        [Op.lte]: nowUTC
                    },
                    status: {
                        [Op.ne]: 'ended' // Chỉ cập nhật khi trạng thái hiện tại không phải 'ended'
                    }
                }
            }
        );
    } catch (error) {
        throw error
    }
}

const runStatusUpdateJob = () => {
    cron.schedule('* * * * *', updateFlashSaleStatus); // Chạy mỗi 10 phut
    console.log('Flash sale status update job started');
}

module.exports = {
    runStatusUpdateJob
}