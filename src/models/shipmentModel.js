const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');
const ShippingMethod = require('./shippingMethodModel');

const Shipment = sequelize.define('Shipment', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    shipping_method_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: ShippingMethod,
            key: 'id'
        }
    },
    tracking_number: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'returned'),
        defaultValue: 'pending'
    },
    shipping_cost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    delivered_at: {
        type: DataTypes.DATE,
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
    tableName: 'Shipments'
});

// Thiết lập quan hệ
// Shipment.belongsTo(ShippingMethod, { foreignKey: 'shipping_method_id' });

module.exports = Shipment;