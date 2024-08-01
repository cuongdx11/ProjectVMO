const cartService = require('../services/cartService')

const createCart = async(req,res,next) => {
    try {
        const user = req.user
        
        const cartData = req.body
        if(user){
            cartData.userId = user.userId
        }
        const session_id = req.sessionID
        cartData.session_id = session_id;
        const cart = await cartService.createCart(cartData)
        res.status(201).json({
            status: 'success',
            message : 'Thêm thành công sản phẩm vào giỏ hàng',
            data: cart
        })
    } catch (error) {
        next(error)
    }
}

const getCartByUser = async(req,res,next) => {
    try {
        const user = req.user
        const cart = await cartService.getCartByUser(user.userId)
        res.status(200).json({
            status: 'success',
            message : 'Lấy giỏ hàng thành công',
            data: cart
        })
    } catch (error) {
        next(error)
    }
}

const deleteCart = async(req,res,next) => {
    try {
        const user = req.user 
        const deleteCart = await cartService.deleteCart(user.userId)
        res.status(200).json(deleteCart)
    } catch (error) {
        next(error)
    }
}
const deleteItemCart = async(req,res,next) => {
    try {
        const user = req.user
        const {itemId} = req.body
        const deleteItem = await cartService.deleteItemCart(user.userId,itemId)
        res.status(200).json(deleteItem)
    } catch (error) {
        next(error)
    }
}
module.exports = {
    createCart,
    getCartByUser,
    deleteCart,
    deleteItemCart
}