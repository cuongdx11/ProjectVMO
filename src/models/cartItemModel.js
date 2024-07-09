const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');
const Cart = require('./cartModel');
const Item = require('./itemModel');
const CartItem = sequelize.define('CartItem', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    cart_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Carts',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // Xóa các CartItem liên quan khi xóa Cart
    },
    item_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Items',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // Xóa các CartItem liên quan khi xóa Item
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1, // Số lượng mặc định là 1
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
}, {
    timestamps: false,
    tableName: 'CartItems'
});



CartItem.belongsTo(Cart, { foreignKey: 'cart_id' });
CartItem.belongsTo(Item, { foreignKey: 'item_id' });

module.exports = CartItem;
