const FlashSale = require('../models/flashsaleModel')
const FlashSaleItem = require('../models/flashsaleitemModel')
const Item = require('../models/itemModel')
const createFlashSale = async(flashsaleData) => {
    try {
        const newFlashSale = await FlashSale.create(flashsaleData)
        return newFlashSale;
    } catch (error) {
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
        return createdItems;
        // const id = flashsaleItemData.item_id
        // const item = await Item.findByPk(id)
        // flashsaleItemData.original_price = item.selling_price
        // const newFlashSaleItem = await FlashSaleItem.create(flashsaleItemData)
        // return newFlashSaleItem;
    } catch (error) {
        throw error
    }
}
module.exports = {
    createFlashSale,
    createFlashSaleItem
}