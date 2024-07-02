const flashSaleService = require('../services/flashsaleService')

const createFlashSale = async(req,res) => {
    try {
        const flashSaleData = req.body
        const flashSale = await flashSaleService.createFlashSale(flashSaleData);
        return res.status(200).json({flashSale})
    } catch (error) {
        return res.status(500).json({error: error.message})
    }
}
const createFlashSaleItem = async(req,res) => {
    try {
        const flashSaleItemData = req.body
        const flashSaleItem = await flashSaleService.createFlashSaleItem(flashSaleItemData);
        return res.status(200).json({flashSaleItem})
    } catch (error) {
        return res.status(500).json({error: error.message})
    }
}
module.exports = {
    createFlashSale,
    createFlashSaleItem
}