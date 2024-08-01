const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');
const User = require('./userModel')
const Voucher = require('./userModel')
const Cart = sequelize.define('Cart', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users', 
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL', // Thay đổi hành động khi xóa user nếu cần
    },
    session_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
    },
    status: {
        type: DataTypes.ENUM('active', 'abandoned', 'converted'),
        defaultValue: 'active',
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
}, {
    timestamps: false,
    tableName: 'Carts'
});

// Định nghĩa các quan hệ
Cart.belongsTo(User, { foreignKey: 'user_id' });


module.exports = Cart;
