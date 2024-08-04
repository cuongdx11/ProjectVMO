const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig'); 
const Category = require('./categoryModel'); 
const ItemImage = require('./itemImageModel');
const Review = require('./reviewModel');
const User = require('./userModel')
const Item = sequelize.define('Item', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    category_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Category,
            key: 'id'
        }
    },
    name: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    barcode: {
        type: DataTypes.STRING(50),
        unique: true
    },
    purchase_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    selling_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    weight: {
        type: DataTypes.DECIMAL(10, 2)
    },
    thumbnail: {
        type: DataTypes.STRING(255)
    },
    description: {
        type: DataTypes.TEXT
    },
    stock_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
    tableName: 'Items'
});

// Thiết lập quan hệ giữa Item và Categorie
Item.belongsTo(Category, { as: 'category',    foreignKey: 'category_id' });
Item.hasMany(ItemImage, { as: 'images', foreignKey: 'item_id' });
Item.hasMany(Review,{as: 'reviews',foreignKey: 'item_id'})

Review.belongsTo(Item, { foreignKey: 'item_id' });
Review.belongsTo(User, { foreignKey: 'user_id' });
module.exports = Item;
