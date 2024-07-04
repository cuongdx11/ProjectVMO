const Voucher = require('../models/voucherModel')
const voucherService = require('../services/voucherService')

const getVoucherAvailable = async(req,res) => {
    try {
        const vouchers = await voucherService.getVoucherAvailable(req.query)
        res.status(200).json(vouchers)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}
const checkVoucher = async(req,res,next) => {
    try {
        const {voucher_code,user_id,orderTotal} = req.query
        const voucher = await voucherService.checkVoucher(voucher_code,user_id,orderTotal)
        res.status(200).json(voucher)
    } catch (error) {
        next(error)
    }
}
module.exports ={
    getVoucherAvailable,
    checkVoucher
}