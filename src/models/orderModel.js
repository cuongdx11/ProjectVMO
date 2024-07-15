const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig'); 
const User = require('./userModel'); 
const Voucher = require('./voucherModel'); 
const ShippingAddress = require('./shippingAddressModel');
const Payment = require('./paymentModel');
const Shipment = require('./shipmentModel');
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
    shipping_address_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: ShippingAddress,
            key: 'id'
        }
    },
    shipment_id: { 
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Shipment,
            key: 'id'
        }
    },
    payment_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Payment,
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
// Order.belongsTo(Voucher, { foreignKey: 'voucher_id' });
Order.belongsTo(ShippingAddress, { foreignKey: 'shipping_address_id' });
Order.belongsTo(Payment, { foreignKey: 'payment_id' });

module.exports = Order;
