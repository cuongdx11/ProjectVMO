const User = require('../models/userModel')
const ErrorRes = require('../helpers/ErrorRes')
const Order = require('../models/orderModel')
const jwt = require('jsonwebtoken');

require('dotenv').config();

const getAllUser = async({page = 1,order=null,filter=null,orderBy='asc',limit=process.env.LIMIT,name = null,...query}) => {
    try {
        const queries = {raw : true , nest: true};
        const offset = (page <= 1) ? 0 : (page - 1);
        const flimit = +limit;
        queries.offset = offset*flimit
        queries.limit = flimit
        let sequelizeOrder = []
        if (order && orderBy) {
            const orderDirection = orderBy.toUpperCase();
            sequelizeOrder.push([order, orderDirection]);
            queries.order = sequelizeOrder
        }
        if (name) query.name = { [Op.substring]: name };

        if (filter && typeof filter === 'object') {
            Object.assign(where, filter);
        }
        const {count , rows} = await User.findAndCountAll({
            where : query,
            attributes: { exclude: ['password'] },
            ...queries
        })
        return {
            users: rows,
            total: count,
            totalPages: Math.ceil(count / flimit),
            currentPage: page
        };

    } catch (error) {
        throw error
    }
}

const getUserById = async(id) => {
    try {
        const user = await User.findByPk(id);
        if(!user){
            throw new ErrorRes(404,'Tài khoản không tồn tại')
        }
        return {
            status : 'success',
            message :'Lấy tài khoản thành công',
            user
        }
    } catch (error) {
        throw error
    }
}
const createUser = async(user) => {
    try {
        const newUser = await User.create(user);
        return {
            status : 'success',
            message :'Tạo tài khoản thành công',
            newUser
        }
    } catch (error) {
        throw error;
    }
}
const updateUser = async(id,userData) => {
    try {
        const user = await User.findByPk(id);
        if(!user){
            throw new ErrorRes(404,'Tài khoản không tồn tại')
        }
        const updatedUser = await user.update(userData);
        return {
            status : 'success',
            message :'Cập nhật tài khoản thành công',
            updatedUser
        }
    } catch (error) {
        throw error;
    }
}
const deleteUser = async(id) => {
    try {
        const user = await User.findByPk(id);
        if(!user){
            throw new ErrorRes(404,'Tài khoản không tồn tại')
        }
        await user.destroy();
        return {
            status : 'success',
            message :'Xóa tài khoản thành công'
        }
    } catch (error) {
        throw error;
    }
}
const getUserOrders = async (token, { page = 1, limit = process.env.LIMIT, status = null }) => {
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const userId = decoded.userId
        const user = await User.findByPk(userId);
        if (!user) {
            throw new ErrorRes(404, 'Tài khoản không tồn tại');
        }

        const queries = { raw: true, nest: true };
        const offset = (page <= 1) ? 0 : (page - 1);
        const flimit = +limit;
        queries.offset = offset * flimit;
        queries.limit = flimit;

        const where = {user_id:  userId };
        if (status) {
            where.status = status;
        }

        const { count, rows } = await Order.findAndCountAll({
            where,
            ...queries,
            order: [['created_at', 'DESC']] // Sắp xếp theo thời gian tạo mới nhất
        });

        return {
            status: 'success',
            message: 'Lấy danh sách đơn hàng thành công',
            orders: rows,
            total: count,
            totalPages: Math.ceil(count / flimit),
            currentPage: page
        };
    } catch (error) {
        throw error;
    }
}
module.exports = {
    getAllUser,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getUserOrders
}