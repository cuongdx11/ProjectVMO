const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig'); 
const User = require('./userModel'); 
const ShippingAddress = require('./shippingAddressModel');
const Payment = require('./paymentModel');
const PaymentMethod = require('./paymentMethodModel');
const ShippingMethod = require('./shippingMethodModel');
const Shipment = require('./shipmentModel');
const OrderItem = require('./orderItemModel');
const Item = require('./itemModel')
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
    subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    discount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    order_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'processing', 'completed', 'cancelled'),
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
Order.belongsTo(User, { as: 'user' ,foreignKey: 'user_id' });
// Order.belongsTo(Voucher, { foreignKey: 'voucher_id' });
Order.hasMany(OrderItem,{as: 'order_items',foreignKey: 'order_id'})

// Thiết lập quan hệ giữa OrderItem và Order, Item
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });
OrderItem.belongsTo(Item, { as:'item',foreignKey: 'item_id' });

Payment.belongsTo(Order, { as: 'order', foreignKey: 'order_id' });
Order.hasOne(Payment,{as: 'payment',foreignKey: 'order_id'});
Shipment.belongsTo(Order,{as: 'order', foreignKey: 'order_id'});
Order.hasOne(Shipment,{as: 'shipment',foreignKey: 'order_id'});
ShippingAddress.belongsTo(Order, { as: 'order', foreignKey: 'order_id' })
Order.hasOne(ShippingAddress,{as: 'shipAddress',foreignKey: 'order_id'});


module.exports = Order;
