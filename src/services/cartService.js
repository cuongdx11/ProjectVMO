const Cart = require('../models/cartModel');
const CartItem = require('../models/cartItemModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const createCart = async (cartData) => {
    let transaction = await Cart.sequelize.transaction();
    try {
        let cart
        let user_id
        const {items, token, session_id} = cartData;
        if(token){
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            user_id = decoded.userId
        }
        if (user_id) {
            // Đối với người dùng đã đăng nhập
            [cart] = await Cart.findOrCreate({
                where: { user_id, status: 'active' },
                defaults: { total_amount: 0 },
                transaction
            });
        } else {
            // Đối với khách vãng lai
            [cart] = await Cart.findOrCreate({
                where: { session_id, status: 'active' },
                defaults: { total_amount: 0 },
                transaction
            });
        }

        // Xử lý các mục giỏ hàng mới
        let updatedTotalAmount = parseFloat(cart.total_amount) || 0;
        for (const item of items) {
            const [cartItem, created] = await CartItem.findOrCreate({
                where: { cart_id: cart.id, item_id: item.item_id },
                defaults: { ...item, cart_id: cart.id },
                transaction
            });

            if (!created) {
                // Nếu mục đã tồn tại, cập nhật số lượng
                await cartItem.update({
                    quantity: cartItem.quantity + item.quantity
                }, { transaction });
            }
            updatedTotalAmount += item.price * item.quantity;
        }
        // Cập nhật tổng số tiền cho giỏ hàng
        await cart.update({ total_amount: updatedTotalAmount }, { transaction });
        // await cart.save()
        await transaction.commit();
        return cart;
    } catch (error) {
        if (transaction) await transaction.rollback();
        throw error;
    }
};

const transferGuestCartToUserCart = async (user_id, session_id) => {
    let transaction = await Cart.sequelize.transaction();
    try {
        // Tìm giỏ hàng của khách vãng lai
        const guestCart = await Cart.findOne({
            where: { session_id, user_id: null, status: 'active' },
            transaction
        });

        if (guestCart) {
            // Cập nhật giỏ hàng với user_id và xóa session_id
            await guestCart.update({ 
                user_id, 
                session_id: null  // Xóa session_id
            }, { transaction });

        } 

        await transaction.commit();
        return guestCart;
    } catch (error) {
        if (transaction) await transaction.rollback();
        throw error;
    }
}

const getCartByUser = async(token) => {
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user_id = decoded.userId
        const cart = await Cart.findOne({
            where: { user_id, status: 'active' }
        })
        return cart;
    } catch (error) {
        throw error
    }
}
module.exports = {
    createCart,
    transferGuestCartToUserCart,
    getCartByUser
}