const User = require('../models/userModel')
const ErrorRes = require('../helpers/ErrorRes')

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
        const user =  await getUserById(id);
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
        const user =  await getUserById(id);
        await user.destroy();
        return {
            status : 'success',
            message :'Xóa tài khoản thành công'
        }
    } catch (error) {
        throw error;
    }
}
module.exports = {
    getAllUser,
    getUserById,
    createUser,
    updateUser,
    deleteUser
}