const Permission = require('../models/permissionModel')
const { sequelize } = require('../config/dbConfig');
const ErrorRes = require('../helpers/ErrorRes');
const RolePermission = require('../models/rolePermissionModel');
const {ROLE} = require('../constants/role')
const createPermission = async(permissionData) => {
    const transaction = await sequelize.transaction()
    try {
        const permission = await Permission.create(permissionData,{transaction})
        await RolePermission.create({
            role_id: ROLE.ADMIN,
            permission_id: permission.id
        },{transaction})
        await transaction.commit()
        return permission
    } catch (error) {
        await transaction.rollback()
        throw error
    }
}
const getAllPermission = async({
    page = 1,
    sortBy = null,
    filter = null,
    order = null,
    pageSize = null,
    search = null,
    ...query
}) => {
    try {
        const offset = page <= 1 ? 0 : page - 1;
        const limit = +pageSize ||+process.env.LIMIT||10
        const queries = {
            raw: true,
            nest: true,
            limit: limit,
            offset: offset*limit,
        }

        let sequelizeOrder = [];
        if (sortBy && order) {
        const orderDirection = order.toUpperCase() || 'asc'
        sequelizeOrder.push([sortBy, orderDirection]);
        queries.order = sequelizeOrder;
        }
        if (search) query.name = { [Op.substring]: search };

        const where = {...query}

        if (filter && typeof filter === "object") {
            Object.entries(filter).forEach(([key,value])=>{
              if(value !== null && value !== undefined){
                where[key] = value
              }
            })
        }
        const { count, rows } = await Permission.findAndCountAll({
            where,
            ...queries,
        });
        return {
            status: "success",
            permissions: rows,
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: +page,
        };
    } catch (error) {
        throw error
    }
}
const getPermissionById = async(id) => {
    try {
        const permission = await Permission.findByPk(id)
        if(!permission){
            throw new ErrorRes(404,'Quyền không tồn tại')
        }
        return {
            status: "success",
            data: permission
        }
    } catch (error) {
        throw error
    }
}
const updatePermission = async(id,permissionData) => {
    try {
        const permission = await Permission.findByPk(id)
        if(!permission){
            throw new ErrorRes(404,'Quyền không tồn tại')
        }
        await permission.update(permissionData)
        return {
            status: "success",
            message: "Cập nhật thành công"
        }
    } catch (error) {
        throw error
    }
}
const deletePermission = async(id) => {
    try {
        const permission = await Permission.findByPk(id)
        if(!permission){
            throw new ErrorRes(404,'Quyền không tồn tại')
        }
        await permission.destroy()
        return {
            status: "success",
            message: "Xóa thành công"
        }
    } catch (error) {
        throw error
    }
}
module.exports = {
    createPermission,
    getAllPermission,
    getPermissionById,
    updatePermission,
    deletePermission
}