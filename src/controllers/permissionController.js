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

module.exports = {
    createPermission
}