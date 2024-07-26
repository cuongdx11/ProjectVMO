const userRoleService = require('../services/userRoleService')


const getUserRoleByUserId = async(req,res,next) => {
    try {
        const {id} = req.params
        const userRole = await userRoleService.getUserRoleByUserId(id)
        res.status(200).json(userRole)
    } catch (error) {
        next(error)
    }
}

const createUserRole = async(req,res,next) => {
    try {
        const {userRoleData} = req.body
        const userRole = await userRoleService.createUserRole(userRoleData)
        res.status(201).json(userRole)
    } catch (error) {
        next(error)
    }
}

const updatedUserRole = async(req,res,next) => {
    try {
        const {userId} = req.params
        const {userRoleData} = req.body
        const userRole = await userRoleService.updateUserRole(userId,userRoleData)
        res.status(200).json(userRole)
    } catch (error) {
        next(error)
    }
}

const deleteUserRole = async(req,res,next) => {
    try {
        const {userId} = req.params
        const userRole = await userRoleService.deleteUserRole(userId)
        res.status(200).json(userRole)
    } catch (error) {
        next(error)
    }
}
module.exports = {
    getUserRoleByUserId,
    createUserRole,
    updatedUserRole,
    deleteUserRole
}