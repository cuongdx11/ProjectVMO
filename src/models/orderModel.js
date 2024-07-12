const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig'); 
const User = require('./userModel'); 
const Voucher = require('./voucherModel'); 

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    voucher_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Voucher,
            key: 'id'
        }
    },
    total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    order_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    status: {
        type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
        defaultValue: 'pending'
    },
    payment_status: {
        type: DataTypes.ENUM('unpaid', 'paid', 'refunded'),
        defaultValue: 'unpaid'
    },
    notes: {
        type: DataTypes.TEXT,
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
    tableName: 'Orders'
});

// Thiết lập quan hệ giữa Order và User, Voucher
Order.belongsTo(User, { foreignKey: 'user_id' });
Order.belongsTo(Voucher, { foreignKey: 'voucher_id' });

module.exports = Order;
