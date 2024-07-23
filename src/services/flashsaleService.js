const { sequelize } = require('../config/dbConfig')
const FlashSale = require('../models/flashSaleModel')
const FlashSaleItem = require('../models/flashsaleitemModel')
const NotificationFlashSale = require('../models/notificationFlashSaleModel')
const Item = require('../models/itemModel')
const { Op } = require('sequelize');
const ErrorRes = require('../helpers/ErrorRes')
const Queue = require('bull')
const redisClient = require('../config/redisConfig')
const flashsaleQueue = new Queue('flashsale-queue',{redis : redisClient})
const createFlashSale = async(flashsaleData) => {
    const transaction = await sequelize.transaction()
    try {
        const newFlashSale = await FlashSale.create(flashsaleData,{transaction})
        const startTime = newFlashSale.start_time;
        const scheduledTime = new Date(new Date(startTime).getTime() - 15 * 60000);
        const endTime = newFlashSale.end_time;
        const notificationFlashSaleData = {
            flash_sale_id : newFlashSale.id,
            scheduled_time : scheduledTime
        }
        await NotificationFlashSale.create(notificationFlashSaleData,{transaction})
        
        await flashsaleQueue.add('notify-flashsale',
            {flashSaleId : newFlashSale.id},
            {
                delay: Math.max(0, scheduledTime.getTime() - new Date().getTime()) - (7 * 3600000),
                jobId: `notify-${newFlashSale.id}`
            }
        )
        
        await flashsaleQueue.add('end-flashsale', 
            { flashSaleId: newFlashSale.id },
            { 
                delay: Math.max(0, endTime.getTime() - new Date().getTime()) - (7 * 3600000),
                jobId: `end-${newFlashSale.id}`
            }
        );
       

        await transaction.commit();

        return {
            status : "success",
            message : "Tạo thành công",
            data : newFlashSale
        }
    } catch (error) {
        await transaction.rollback();
        throw error
    }
}
const createFlashSaleItem = async(flashsaleItemData) => {
    try {
        const createdItems = [];
        const itemsData = flashsaleItemData.items
        for(const itemData of itemsData){
            const item = await Item.findByPk(itemData.item_id)
            if (!item) {
                // throw new Error(`Item with id ${itemData.item_id} not found`);
                throw new ErrorRes(404,'Sản phẩm không tồn tại')
            }
            const flashSaleItemData = {
                ...itemData,
                flash_sale_id: flashsaleItemData.flash_sale_id,
                original_price: item.selling_price
            };
            const newFlashSaleItem = await FlashSaleItem.create(flashSaleItemData);
            createdItems.push(newFlashSaleItem);
        }
        return {
            status : "success",
            message : "Tạo thành công",
            data : createdItems
        }
    } catch (error) {
        throw error
    }
}
const getFlashSaleById = async(id) => {
    try {
        const flashSale = await FlashSale.findByPk(id)
        if(!flashSale){
            throw new ErrorRes(404,'Flash sale không tồn tại')
        }
        return{
            status : "success",
            message : "Lấy thành công",
            data : flashSale
        }
    } catch (error) {
        throw error
    }
}
const updateFlashSale = async(id,flashSaleData) => {
    try {
        const flashSale = await FlashSale.findByPk(id)
        const updatedFlashSale = await flashSale.update(flashSaleData)
        return{
            status : "success",
            message : "Cập nhật thành công",
            data : updatedFlashSale
        }
    } catch (error) {
        throw error
    }
}
const deleteFlashSale = async(id) => {
    try {
        const flashSale = await FlashSale.findByPk(id)
        await flashSale.destroy()
        return{
            status : "success",
            message : "Xóa thành công"
        }
    } catch (error) {
        throw error
    }
}
const getFlashSaleItem = async(id) => {
    try {
        const flashSaleeItems = await FlashSaleItem.findAndCountAll({
            where : {
                flash_sale_id : id
            }
        })
        if(!flashSaleeItems){
            throw new ErrorRes(404,'Không có sản phẩm nào')
        }
        return{
            status : "success",
            message : "Lấy thành công",
            data : flashSaleeItems
        }
    } catch (error) {
        throw error
    }
}
const getFlashSaleItemById = async(id,item_id) => {
    try {
        const flashSaleItem = await FlashSaleItem.findOne({
            where : {
                flash_sale_id : id,
                item_id : item_id
            }
        })
        if(!flashSaleItem){
            throw new ErrorRes(404,'Không có sản phẩm nào')
        }
        return{
            status : "success",
            message : "Lấy thành công",
            data : flashSaleItem
        }
    } catch (error) {
        throw error
    }
}
const getActiveFlashSales = async() => {
    try {
        const now = new Date()
        // const nowUTC = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
        const activeFlashSales = await FlashSale.findAll({
            where: {
                start_time: { [Op.lte]: now },
                end_time: { [Op.gt]: now }
              }
        })
        if(!activeFlashSales){
            throw new ErrorRes(404,'Không có sản phẩm nào')
        }
        return{
            status : "success",
            message : "Lấy thành công",
            data : activeFlashSales
        }
    } catch (error) {
        throw error
    }
}
module.exports = {
    createFlashSale,
    createFlashSaleItem,
    getFlashSaleById,
    updateFlashSale,
    deleteFlashSale,
    getFlashSaleItem,
    getFlashSaleItemById,
    getActiveFlashSales
}