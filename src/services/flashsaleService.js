const { sequelize } = require('../config/dbConfig')
const FlashSale = require('../models/flashsaleModel')
const FlashSaleItem = require('../models/flashsaleitemModel')
const Notification = require('../models/notificationModel')
const Item = require('../models/itemModel')
const ErrorRes = require('../helpers/ErrorRes')
const createFlashSale = async(flashsaleData) => {
    const transaction = await sequelize.transaction()
    try {
        const newFlashSale = await FlashSale.create(flashsaleData,{transaction})
        const startTime = newFlashSale.start_time;
        const scheduledTime = new Date(new Date(startTime).getTime() - 15 * 60000);
        const notificationFlashSaleData = {
            flash_sale_id : newFlashSale.id,
            scheduled_time : scheduledTime
        }
        await Notification.create(notificationFlashSaleData,{transaction})
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
module.exports = {
    createFlashSale,
    createFlashSaleItem
}