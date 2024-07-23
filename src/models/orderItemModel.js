const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig'); // Cập nhật đường dẫn cho đúng
const Order = require('./orderModel'); // Import model Order để thiết lập quan hệ
const Item = require('./itemModel'); // Import model Item để thiết lập quan hệ

const OrderItem = sequelize.define('OrderItem', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    order_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Orders',
            key: 'id'
        }
    },
    item_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Items',
            key: 'id'
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false,
    tableName: 'OrderItems'
});



module.exports = OrderItem;
