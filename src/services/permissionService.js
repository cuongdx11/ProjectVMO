const Permission = require('../models/permissionModel')
const { sequelize } = require('../config/dbConfig');
const createPermission = async(permissionData) => {
    const transaction = await sequelize.transaction()
    try {
        const permission = await Permission.create(permissionData,{transaction})
        await transaction.commit()
        return permission
    } catch (error) {
        await transaction.rollback()
        throw error
    }
}

module.exports = {
    createPermission
}