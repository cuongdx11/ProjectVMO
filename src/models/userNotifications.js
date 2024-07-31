const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');
const User = require('./userModel');

const UserNotification = sequelize.define('UserNotification', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: User,
            key: 'id'
        }
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    type: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false,
    tableName: 'UserNotifications'
});

// Thiết lập quan hệ
UserNotification.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(UserNotification, { foreignKey: 'user_id' });

module.exports = UserNotification;
