const { Op } = require('sequelize')
const Voucher = require('../models/voucherModel')
const ErrorRes = require('../helpers/ErrorRes')
const User = require('../models/userModel')
const getVoucherAvailable = async({orderTotal,userId,...query}) => {
    try {
        const user = await User.findByPk(userId)
        if(!user){
            throw new ErrorRes('User not found',404)
        }
        const timeSignUser = new Date(user.created_at);
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const isNewUser = timeSignUser >= oneMonthAgo
        let where ={
            min_order_value : {
                [Op.lte] : orderTotal
            }
        }
        if(isNewUser) {
            where = {
                [Op.or] : [
                    {
                        type : 'newuser'
                    },
                    where
                ]
            }
        }
        const vouchers = await Voucher.findAll({
            where
        })
        if (!vouchers || vouchers.length === 0) {
            throw new ErrorRes(404, 'Không có voucher phù hợp');
        }
        return {
            status : 'success',
            vouchers
        }
        

    } catch (error) {
        throw error
    }
}
const checkVoucher = async(voucher_code,user_id,orderTotal) => {
    try {
        const voucher = await Voucher.findOne({
            where : {
                code : voucher_code,
                min_order_value : {
                    [Op.lte] : orderTotal
                }
            }
        })
        if(!voucher) {
            throw new ErrorRes(404,'Voucher không tồn tại hoặc không đáp ứng được điều kiện')
        }
        
    
        return {
            status : 'success',
            voucher
        }
    } catch (error) {
        throw error
    }
}
const createVoucher = async(voucherData) => {
    try {
        const voucher = await Voucher.create(voucherData)
        return {
            status : 'success',
            message: 'Tạo thành công voucher',
            voucher
        }
    } catch (error) {
        
    }
}
const getVoucherById = async(id) => {
    try {
        const voucher = await Voucher.findByPk(id)
        if(!voucher){
            throw new ErrorRes(404,'Voucher không tồn tại')
        }
        return {
            status : 'success',
            voucher
        }
    } catch (error) {
        throw error
    }
}
const updateVoucher = async(id,voucherData) => {
    try {
        const voucher = await Voucher.findByPk(id)
        if(!voucher){
            throw new ErrorRes(404,'Voucher không tồn tại')
        }
        const updatedVoucher = await voucher.update(voucherData)
        return {
            status : 'success',
            message: 'Cập nhật voucher thành công',
            updatedVoucher
        }
    } catch (error) {
        throw error
    }
}
const deleteVoucher = async(id) => {
    try {
        const voucher = await Voucher.findByPk(id)
        if(!voucher){
            throw new ErrorRes(404,'Voucher không tồn tại')
        }
        await voucher.destroy()
        return {
            status : 'success',
            message: 'Xóa voucher thành công'
        }
    } catch (error) {
        throw error
    }
}
module.exports = {
    getVoucherAvailable,
    checkVoucher,
    getVoucherById,
    createVoucher,
    updateVoucher,
    deleteVoucher
}