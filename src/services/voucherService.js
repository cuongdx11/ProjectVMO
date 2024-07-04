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
module.exports = {
    getVoucherAvailable,
    checkVoucher
}