const Queue = require('bull')
const redisClient = require('../config/redisConfig')
const flashsaleQueue = new Queue('flashsale-queue',{redis : redisClient})
const {sendMailFlashSale,checkFlashSale} = require('../helpers/flashSaleNotification')
const FlashSale = require('../models/flashSaleModel')

flashsaleQueue.process('notify-flashsale',async(job) => {
    const {flashSaleId} = job.data
    const flashSaleData = await FlashSale.findByPk(flashSaleId)
    if(flashSaleData){
        await sendMailFlashSale(flashSaleData)
        console.log(`Đã gửi thông báo cho flashsale ${flashSaleId}`);
    }
})

flashsaleQueue.process('end-flashsale',async(job) => {
    const {flashSaleId} = job.data
    const flashSale = await FlashSale.findByPk(flashSaleId)
    if(flashSale) {
        flashSale.status = 'ended'
        await flashSale.save()
        console.log(`Đã kết thúc flashsale ${flashSaleId}`)
    }
})

flashsaleQueue.on('completed', (job) => {
    console.log(`Job ${job.id} đã hoàn thành thành công`);
});

flashsaleQueue.on('failed', (job, error) => {
    console.error(`Job ${job.id} thất bại:`, error);
});

console.log('Flashsale worker đang chạy');