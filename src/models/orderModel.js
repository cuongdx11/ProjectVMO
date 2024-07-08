const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig'); // Cập nhật đường dẫn cho đúng
const User = require('./userModel'); // Import model User để thiết lập quan hệ
const Voucher = require('./voucherModel'); // Import model Voucher để thiết lập quan hệ

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
    status: {
        type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
        defaultValue: 'pending'
    },
    payment_status: {
        type: DataTypes.ENUM('unpaid', 'paid', 'refunded'),
        defaultValue: 'unpaid'
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
