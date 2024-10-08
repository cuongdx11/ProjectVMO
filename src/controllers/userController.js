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
        const user = req.user
        const result = await userService.getUserOrders(user.userId, req.query);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}
const getProfileUser = async(req,res,next) => {
    try {
        const user = req.user
        const profileUser = await userService.getProfileUser(user.userId)
        res.status(200).json(profileUser);
    } catch (error) {
        next(error)
    }
}
const updateProfileUser = async(req,res,next) => {
    try {

        const user = req.user 
        const profileData = req.body
        const profileUser = await userService.updateProfileUser(user.userId,profileData)
        res.status(200).json(profileUser);
    } catch (error) {
        next(error)
    }
}

const updateAvatarUser = async(req,res,next) => {
    try {
        const file = req.file
        const user = req.user
        const avatar = file.path
        const avatarUser = await userService.updateAvatarUser(user.userId,avatar)
        res.status(200).json(avatarUser);
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
const getUserNotifications = async(req,res,next) => {
    try {
        const user = req.user
        const notifications = await userService.getUserNotifications(user.userId)
        res.status(200).json(notifications);
    } catch (error) {
        next(error)
    }
}
const maskAsRead = async(req,res,next) => {
    try {
        const user = req.user
        const mask = await userService.maskAsRead(user.userId)
        res.status(200).json(mask);
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
    sendInvitationUser,
    getUserNotifications,
    maskAsRead
    
    
}