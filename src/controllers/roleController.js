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
module.exports = {
    createRole,
    getRoleById
}