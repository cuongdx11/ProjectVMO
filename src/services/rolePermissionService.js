const RolePermission = require('../models/rolePermissionModel')
const Role = require('../models/roleModel')
const Permission = require('../models/permissionModel')
const ErrorRes = require('../helpers/ErrorRes')


const createRolePermission = async(rolePermissionData) => {
    try {
        const rolePermission = await RolePermission.create(rolePermissionData)
        return {
            status: 'success',
            data: rolePermission
        }
    } catch (error) {
        throw error
    }
}

const getRolePermissionByRoleId = async(roleId) => {
    try {
        const rolePermission = await Role.findOne({
            where: { id: roleId },
            attributes: ['name','description'],
            include: [
                {
                    model: Permission,
                    as: 'permissions',
                    attributes: ['name','description'],
                    through: { attributes: [] }
                }
            ]
        })
        if(!rolePermission) {
            throw new ErrorRes(404,'Not Found')
        }
        return {
            status: 'success',
            rolePermission
        }
    } catch (error) {
        throw error
    }
}

const updateRolePermission = async(roleId,permissionId) => {
    try {
        await RolePermission.create({
            role_id: roleId,
            permission_id: permissionId
        })
    } catch (error) {
        throw error
    }
}

const deleteRolePermission = async(roleId,permissionId) => {
    try {
        await RolePermission.destroy({
            where: { role_id: roleId, permission_id: permissionId }
        })
    } catch (error) {
        throw error
    }
}





module.exports = {
    createRolePermission,
    getRolePermissionByRoleId,
    updateRolePermission,
    deleteRolePermission
}