const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');
const Order = require('./orderModel'); 
const Voucher = require('./voucherModel'); 

const OrderDiscount = sequelize.define('OrderDiscount', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Order,
            key: 'id'
        }
    },
    voucher_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Voucher,
            key: 'id'
        }
    },
    discount_applied: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
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
    tableName: 'OrderDiscounts'
});

// Thiết lập quan hệ
OrderDiscount.belongsTo(Order, { foreignKey: 'order_id' });
OrderDiscount.belongsTo(Voucher, {as: 'voucher', foreignKey: 'voucher_id' });

Order.hasMany(OrderDiscount, {as: 'order_discounts' ,foreignKey: 'order_id' });
// Voucher.hasMany(OrderDiscount, {as: 'order_discounts', foreignKey: 'voucher_id' });

module.exports = OrderDiscount;
