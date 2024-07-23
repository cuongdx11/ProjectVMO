const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig'); 


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
