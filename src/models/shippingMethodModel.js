const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');

const ShippingMethod = sequelize.define('ShippingMethod', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    base_cost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    carrier: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
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
    tableName: 'shippingmethods'
});

module.exports = ShippingMethod;