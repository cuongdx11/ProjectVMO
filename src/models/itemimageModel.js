const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig'); 
const Item = require('./itemModel'); 

const ItemImage = sequelize.define('ItemImage', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    item_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Items',
            key: 'id'
        }
    },
    image_url: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false,
    tableName: 'ItemImages'
});

// Thiết lập quan hệ giữa ItemImage và Item
ItemImage.associate = function() {
    ItemImage.belongsTo(Item, {as:'images', foreignKey: 'item_id' });
};


module.exports = ItemImage;
