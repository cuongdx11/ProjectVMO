const ErrorRes = require('../helpers/ErrorRes');
const User = require('../models/userModel')
const userService = require('../services/userService')
const authService = require('../services/authService')
const getUsers = async (req, res) => {
    try {
        const users = await userService.getAllUser(req.query)
        res.status(200).json(users);
    } catch (error) {
        console.error('Error getting users:', error);
        res.status(404).json({ message: 'Internal server error' });
    }
};

const changePass = async(req,res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Lấy token sau 'Bearer'
        const {newPass} = req.body
        const resp = await authService.changePass(token,newPass)
        res.status(200).json(resp)
    } catch (error) {
        res.status(404).json({ message: 'Internal server error' });
    }
}

const getUserById = async(req,res) => {
    try {
        const {id} = req.params;
        const user = await userService.getUserById(id)
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: 'Internal server error' });
    }
}
const createUser = async(req , res) => {
    try {
        const newUserData = req.body
        const user = await userService.createUser(newUserData)
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: 'Internal server error' });
    }
}
const updateUser = async(req , res) => {
    try {
        const {id} = req.params
        const userData = req.body
        const user = await userService.updateUser(id,userData)
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: 'Internal server error' });
    }
}
const deleteUser = async(req , res) => {
    try {
        const {id} = req.params
        const user = await userService.deleteUser(id)
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: 'Internal server error' });
    }
}
module.exports = {
    getUsers,
    changePass,
    getUserById,
    createUser,
    updateUser,
    deleteUser
    
    
}