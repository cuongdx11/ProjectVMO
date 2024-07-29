const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig'); 
const FlashSale = require('./flashSaleModel'); 
const Item = require('./itemModel'); 

const FlashSaleItem = sequelize.define('FlashSaleItem', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    flash_sale_id: {
        type: DataTypes.INTEGER,
        references: {
            model: FlashSale,
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
    original_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    flash_sale_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    max_quantity_per_customer: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    sold_quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0
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
    tableName: 'FlashSaleItems'
});

// Thiết lập quan hệ giữa FlashSaleItem và FlashSale, Item
FlashSaleItem.belongsTo(FlashSale, {as:'flashSale', foreignKey: 'flash_sale_id' });
FlashSale.hasMany(FlashSaleItem,{as: 'items',foreignKey: 'flash_sale_id'})
FlashSaleItem.belongsTo(Item, {as:'flash_sale', foreignKey: 'item_id' });


module.exports = FlashSaleItem;
