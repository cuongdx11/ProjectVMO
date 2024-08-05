const voucherService = require('../services/voucherService')

const getAllVoucher = async(req,res,next) => {
    try {
        const listVoucher = await voucherService.getAllVoucher(req.query)
        return res.status(200).json(listVoucher);
    } catch (error) {
        next(error)
    }
}
const getVoucherAvailable = async(req,res,next) => {
    try {
        const vouchers = await voucherService.getVoucherAvailable(req.query)
        res.status(200).json(vouchers)
    } catch (error) {
        next(error)
    }
}
const checkVoucher = async(req,res,next) => {
    try {
        const {voucher_code,user_id,orderTotal} = req.query
        const voucher = await voucherService.checkVoucher(voucher_code,orderTotal)
        res.status(200).json(voucher)
    } catch (error) {
        next(error)
    }
}
const createVoucher = async(req,res,next) => {
    try {
       const voucherData = req.body
       const voucher = await voucherService.createVoucher(voucherData)
       res.status(201).json(voucher)
    } catch (error) {
       next(error)
    }
}
const getVoucherById = async(req,res,next) => {
    try {
        const {id} = req.params
        const voucher = await voucherService.getVoucherById(id)
        res.status(200).json(voucher)
    } catch (error) {
        next(error)
    }
}
const updateVoucher = async(req,res,next) => {
    try {
        const {id} = req.params
        const voucherData = req.body
        const voucher = await voucherService.updateVoucher(id,voucherData)
        res.status(200).json(voucher)
    } catch (error) {
       next(error) 
    }
}
const deleteVoucher = async(req,res,next) => {
    try {
        const {id} = req.params
        const voucher = await voucherService.deleteVoucher(id)
        res.status(200).json(voucher)
    } catch (error) {
        next(error)
    }
}

module.exports ={
    getVoucherAvailable,
    checkVoucher,
    createVoucher,
    getVoucherById,
    updateVoucher,
    deleteVoucher,
    getAllVoucher
}