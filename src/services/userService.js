const User = require('../models/userModel')
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
        throw new Error(`Error: ${error.message}`);
    }
}

const getUserById = async(id) => {
    try {
        const user = await User.findByPk(id);
        if(!user){
            throw new Error(`User with id ${id} not found`)
        }
        return user;
    } catch (error) {
        throw new Error(`Error: ${error.message}`);
    }
}
const createUser = async(user) => {
    try {
        const newUser = await User.create(user);
        return newUser;
    } catch (error) {
        throw error;
    }
}
const updateUser = async(id,userData) => {
    try {
        const user =  await getUserById(id);
        const updatedUser = await user.update(userData);
        return updatedUser;
    } catch (error) {
        throw error;
    }
}
const deleteUser = async(id) => {
    try {
        const user =  await getUserById(id);
        await user.destroy();
        return {
            message: `User with id ${id} deleted successfully`
        }
    } catch (error) {
        
    }
}
module.exports = {
    getAllUser,
    getUserById,
    createUser,
    updateUser,
    deleteUser
}