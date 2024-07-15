const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig'); 


const ShippingAddress = sequelize.define('ShippingAddress', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    receiver_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    phone_number: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    address_line1: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    address_line2: {
        type: DataTypes.STRING(255)
    },
    city: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    state: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    country: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW
    }
}, {
    tableName: 'ShippingAddress',
    timestamps: false 
});



module.exports = ShippingAddress;
