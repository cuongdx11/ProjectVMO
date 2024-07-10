const Role = require('../models/roleModel')
const { sequelize } = require('../config/dbConfig');
const ErrorRes = require('../helpers/ErrorRes')
const createRole = async(roleData) => {
    const transaction = await sequelize.transaction();
    try {
        const role = await Role.create(roleData, { transaction })
        await transaction.commit();
        return role
    } catch (error) {
        await transaction.rollback();
        throw error
    }
}
const getRoleById = async(id) => {
    try {
        const role = await Role.findByPk(id)
        if(!role){
            throw new ErrorRes(404,'Role không tồn tại')
        }
        return role
    } catch (error) {
        throw error
    }
}

module.exports = {
    createRole,
    getRoleById
}