const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig'); // Cập nhật đường dẫn cho đúng
const Item = require('./itemModel'); // Import model Item để thiết lập quan hệ

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
    ItemImage.belongsTo(Item, { foreignKey: 'item_id' });
};


module.exports = ItemImage;
