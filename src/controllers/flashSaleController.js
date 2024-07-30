const flashSaleService = require('../services/flashSaleService')

const createFlashSale = async(req,res,next) => {
    try {
        const flashSaleData = req.body
        const flashSale = await flashSaleService.createFlashSale(flashSaleData);
        return res.status(200).json({flashSale})
    } catch (error) {
        next(error)
    }
}
const createFlashSaleItem = async(req,res,next) => {
    try {
        const flashSaleItemData = req.body
        const flashSaleItem = await flashSaleService.createFlashSaleItem(flashSaleItemData);
        return res.status(200).json({flashSaleItem})
    } catch (error) {
        next(error)
    }
}
const getAllFlashSale = async(req,res,next) => {
    try {
        const listFlashSale = await flashSaleService.getAllFlashSale(req.query)
        return res.status(200).json(listFlashSale)
    } catch (error) {
        next(error)
    }
}
const getFlashSaleById = async(req,res,next) => {
    try {
        const {id} = req.params
        const flashSale = await flashSaleService.getFlashSaleById(id)
        return res.status(200).json(flashSale)
    } catch (error) {
        next(error)
    }
}
const updateFlashSale = async(req,res,next) => {
    try {
        const {id} = req.params
        const flashSaleData = req.body
        const flashSale = await flashSaleService.updateFlashSale(id,flashSaleData)
        return res.status(200).json(flashSale)
    } catch (error) {
        next(error)
    }
}
const deleteFlashSale = async(req,res,next) => {
    try {
        const {id} = req.params
        const flashSale = await flashSaleService.deleteFlashSale(id)
        return res.status(200).json(flashSale)
    } catch (error) {
        next(error)
    }
}
const getFlashSaleItem = async(req,res,next) => {
    try {
        const {id} = req.params
        const flashSaleItem = await flashSaleService.getFlashSaleItem(id)
        return res.status(200).json(flashSaleItem)
    } catch (error) {
        next(error)
    }
}
const getFlashSaleItemById = async(req,res,next) => {
    try {
        const {id,item_id} = req.params
        const flashSaleItem = await flashSaleService.getFlashSaleItemById(id,item_id)
        return res.status(200).json(flashSaleItem)
    } catch (error) {
        next(error)
    }
}
const getActiveFlashSales = async(req,res,next) => {
    try {
        const activeFlashSales = await flashSaleService.getActiveFlashSales()
        return res.status(200).json(activeFlashSales)
    } catch (error) {
        next(error)
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
    getActiveFlashSales,
    getAllFlashSale
}
