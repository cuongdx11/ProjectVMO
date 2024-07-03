const { sequelize } = require('../config/dbConfig')
const FlashSale = require('../models/flashsaleModel')
const FlashSaleItem = require('../models/flashsaleitemModel')
const Notification = require('../models/notificationModel')
const Item = require('../models/itemModel')
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
        return newFlashSale;
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
                throw new Error(`Item with id ${itemData.item_id} not found`);
            }
            const flashSaleItemData = {
                ...itemData,
                flash_sale_id: flashsaleItemData.flash_sale_id,
                original_price: item.selling_price
            };
            const newFlashSaleItem = await FlashSaleItem.create(flashSaleItemData);
            createdItems.push(newFlashSaleItem);
        }
        return createdItems
    } catch (error) {
        throw error
    }
}
module.exports = {
    createFlashSale,
    createFlashSaleItem
}