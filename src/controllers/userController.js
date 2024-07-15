const ErrorRes = require('../helpers/ErrorRes');
const User = require('../models/userModel')
const userService = require('../services/userService')
const authService = require('../services/authService')
const getUsers = async (req, res,next) => {
    try {
        const users = await userService.getAllUser(req.query)
        res.status(200).json(users);
    } catch (error) {
        console.error('Error getting users:', error);
        next(error)
    }
};

const changePass = async(req,res,next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Lấy token sau 'Bearer'
        const {newPass} = req.body
        const resp = await authService.changePass(token,newPass)
        res.status(200).json(resp)
    } catch (error) {
        next(error)
    }
}

const getUserById = async(req,res,next) => {
    try {
        const {id} = req.params;
        const user = await userService.getUserById(id)
        res.status(200).json(user);
    } catch (error) {
        next(error)
    }
}
const createUser = async(req , res,next) => {
    try {
        const newUserData = req.body
        const user = await userService.createUser(newUserData)
        res.status(200).json(user);
    } catch (error) {
        next(error)
    }
}
const updateUser = async(req , res,next) => {
    try {
        const {id} = req.params
        const userData = req.body
        const user = await userService.updateUser(id,userData)
        res.status(200).json(user);
    } catch (error) {
        next(error)
    }
}
const deleteUser = async(req , res,next) => {
    try {
        const {id} = req.params
        const user = await userService.deleteUser(id)
        res.status(200).json(user);
    } catch (error) {
        next(error)
    }
}
const getOrdersForUser = async (req, res, next) => {
    try {
        // const { userId } = req.params;
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Lấy token sau 'Bearer'
        const { page, limit, status } = req.query;
        const result = await userService.getUserOrders(token, { page, limit, status });
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getUsers,
    changePass,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getOrdersForUser,
    
    
}