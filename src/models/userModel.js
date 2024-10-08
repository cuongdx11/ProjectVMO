const { DataTypes } = require('sequelize')
const {sequelize} = require('../config/dbConfig');
const Role = require('./roleModel');
const UserRole = require('./userRoleModel');
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    avatar: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    full_name: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    is_admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    is_notification: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    reset_password_token: {
        type: DataTypes.STRING,
        allowNull: true
    },
    reset_password_expires: {
        type: DataTypes.DATE,
        allowNull: true
    },
    refresh_token: {
        type: DataTypes.STRING,
        allowNull: true
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
    tableName: 'Users'
});
User.belongsToMany(Role, {as:'role', through: UserRole, foreignKey: 'user_id' });
Role.belongsToMany(User, {as:'userRoles' ,through: UserRole, foreignKey: 'role_id' });
UserRole.belongsTo(User,{as:'user',foreignKey:'user_id'})
UserRole.belongsTo(Role,{as:'role',foreignKey:'role_id'})
User.hasMany(UserRole,{as:'roleUsers',foreignKey:'user_id'})
Role.hasMany(UserRole,{as:'roles',foreignKey:'role_id'})

module.exports = User;
