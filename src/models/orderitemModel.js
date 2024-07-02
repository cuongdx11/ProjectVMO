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
            model: Order,
            key: 'id'
        }
    },
    item_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Item,
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

// Thiết lập quan hệ giữa OrderItem và Order, Item
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });
OrderItem.belongsTo(Item, { foreignKey: 'item_id' });

module.exports = OrderItem;
