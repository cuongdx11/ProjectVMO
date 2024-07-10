const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');
const RolePermission = sequelize.define('RolePermission', {
    role_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Roles',
            key: 'id'
        }
    },
    permission_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Permissions',
            key: 'id'
        }
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false,
    tableName: 'RolePermissions'
});

// Thiết lập quan hệ


module.exports = RolePermission;