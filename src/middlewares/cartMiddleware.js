const  Cart  = require('../models/cartModel'); 

const cartTransferMiddleware = async (req, res, next) => {
    if (!req.user || !req.sessionID) {
        return next();
    }

    const user = req.user;
    const user_id = user.userId
    const session_id = req.sessionID

    let transaction;
    try {
        transaction = await Cart.sequelize.transaction();

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

            // Gán giỏ hàng đã chuyển đổi vào req object để sử dụng ở các middleware tiếp theo nếu cần
            req.transferredCart = guestCart;
        }

        await transaction.commit();
        next();
    } catch (error) {
        if (transaction) await transaction.rollback();
        console.error('Error transferring cart:', error);
        next(error);
    }
};

module.exports = {
    cartTransferMiddleware
};