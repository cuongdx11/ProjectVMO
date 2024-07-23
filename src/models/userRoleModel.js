const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');


const UserRole = sequelize.define('UserRole', {
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    role_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Roles',
            key: 'id'
        }
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false,
    tableName: 'UserRoles'
});

// Thiết lập quan hệ
module.exports = UserRole;