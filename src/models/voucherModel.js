const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig'); // Cập nhật đường dẫn cho đúng

const Voucher = sequelize.define('Voucher', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'general' // or any default value you prefer
    },
    discount_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    discount_type: {
        type: DataTypes.ENUM('percentage', 'fixed'),
        allowNull: false
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    remaining_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    min_order_value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
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
    tableName: 'Vouchers'
});

module.exports = Voucher;
