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
        const file = req.file
        const avatar = file.path
        newUserData.avatar = avatar
        const user = await userService.createUser(newUserData)
        res.status(200).json(user);
    } catch (error) {
        next(error)
    }
}
const updateUser = async(req , res,next) => {
    try {
        const userData = req.body
        const {id} = req.params
        const file = req.file
        if(file){
            const avatar = file.path
            userData.avatar = avatar
        }
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
        const result = await userService.getUserOrders(token, req.query);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}
const getProfileUser = async(req,res,next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; 
        const user = await userService.getProfileUser(token)
        res.status(200).json(user);
    } catch (error) {
        next(error)
    }
}
const updateProfileUser = async(req,res,next) => {
    try {

        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; 
        const profileData = req.body
        const user = await userService.updateProfileUser(token,profileData)
        res.status(200).json(user);
    } catch (error) {
        next(error)
    }
}

const updateAvatarUser = async(req,res,next) => {
    try {
        const file = req.file
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; 
        const avatar = file.path
        const user = await userService.updateAvatarUser(token,avatar)
        res.status(200).json(user);
    } catch (error) {
        next(error)
    }
}

const sendInvitationUser = async(req,res,next) => {
    try {
        const userData = req.body
        const userRes = await userService.sendInvitationUser(userData)
        res.status(200).json(userRes);
    } catch (error) {
        next(error)
    }
}
module.exports = {
    getUsers,
    getUserById,
    getProfileUser,
    createUser,
    updateUser,
    deleteUser,
    getOrdersForUser,
    updateProfileUser,
    updateAvatarUser,
    sendInvitationUser
    
    
}