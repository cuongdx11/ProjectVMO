const permissionService = require('../services/permissionService')


const createPermission = async(req,res,next) => {
    try {
        const permissionData = req.body
        const permission = await permissionService.createPermission(permissionData)
        res.status(201).json({
            status: 'success',
            data: permission
        })
    } catch (error) {
        next(error)
    }
}
const getAllPermission = async(req,res,next) => {
    try {
        const permissionList = await permissionService.getAllPermission(req.query)
        res.status(200).json(permissionList)
    } catch (error) {
        next(error)
    }
}
const getPermissionById = async(req,res,next) => {
    try {
        const {id} = req.params
        const permission = await permissionService.getPermissionById(id)
        res.status(200).json(permission)
    } catch (error) {
        next(error)
    }
}
const updatePermission = async(req,res,next) => {
    try {
        const {id} = req.params
        const {permissionData} = req.body
        const permission = await permissionService.updatePermission(id,permissionData)
        res.status(200).json(permission)
    } catch (error) {
        next(error)
    }
}
const deletePermission = async(req,res,next) => {
    try {
        const {id} = req.params
        const permission = await permissionService.deletePermission(id)
        res.status(200).json(permission)
    } catch (error) {
        next(error)
    }
}
module.exports = {
    createPermission,
    getAllPermission,
    getPermissionById,
    updatePermission,
    deletePermission
}