const roleService = require('../services/roleService')


const createRole = async(req,res,next) => {
    try {
        const roleData = req.body
        const role = await roleService.createRole(roleData)
        res.status(200).json(role)
    } catch (error) {
        next(error)
    }
}
const getAllRole = async(req,res,next) => {
    try {
        const roleList = await roleService.getAllRole(req.query)
        res.status(200).json(roleList)
    } catch (error) {
        next(error)
    }
}
const getRoleById = async(req,res,next) => {
    try {
        const {id} = req.params
        const role = await roleService.getRoleById(id)
        res.status(200).json({
            status : 'success',
            data : role
        })
    } catch (error) {
        next(error)
    }
}
const updateRole = async(req,res,next) => {
    try {
        const {id} = req.params
        const {roleData} = req.body
        const role = await roleService.updateRole(id,roleData)
        res.status(200).json(role)
    } catch (error) {
        next(error)
    }
}
const deleteRole = async(req,res,next) => {
    try {
        const {id} = req.params
        const role = await roleService.deleteRole(id)
        res.status(200).json(role)
    } catch (error) {
        next(error)
    }
}
module.exports = {
    createRole,
    getAllRole,
    getRoleById,
    updateRole,
    deleteRole
}