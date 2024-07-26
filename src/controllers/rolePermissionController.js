const rolePermissionService = require('../services/rolePermissionService')
const rolePermissionEventEmitter = require('../helpers/events')
const createRolePermission = async(req,res,next) => {
    try {
        const {rolePermissionData} = req.body
        const rolePermission = await rolePermissionService.createRolePermission(rolePermissionData)
        res.status(200).json(rolePermission)
    } catch (error) {
        next(error)
    }
}

const getRolePermissionByRoleId = async(req,res,next) => {
    try {
        const {roleId} = req.params
        const rolePermission = await rolePermissionService.getRolePermissionByRoleId(roleId)
        res.status(200).json(rolePermission)
    } catch (error) {
        next(error)
    }
}

const updateRolePermission = async(req,res,next) => {
    try {
        const {roleId} = req.params
        const {permissionId} = req.body
        
        const rolePermission = rolePermissionEventEmitter.emit('update-rolePermission',{roleId,permissionId})
        res.status(200).json(rolePermission)
    } catch (error) {
        next(error)
    }
}
const deleteRolePermission = async(req,res,next) => {
    try {
        const {roleId} = req.params
        const {permissionId} = req.body
        const rolePermission = rolePermissionEventEmitter.emit('delete-rolePermission',{roleId,permissionId})
        res.status(200).json(rolePermission)
    } catch (error) {
        next(error)
    }
}
module.exports = {
    createRolePermission,
    getRolePermissionByRoleId,
    updateRolePermission,
    deleteRolePermission
}