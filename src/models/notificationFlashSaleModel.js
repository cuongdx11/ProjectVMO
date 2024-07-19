const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig'); // Cập nhật đường dẫn cho đúng
const FlashSale = require('./flashsaleModel'); // Import model FlashSale để thiết lập quan hệ

const NotificationFlashSale = sequelize.define('NotificationFlashSale', {
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
    is_sent: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    scheduled_time: {
        type: DataTypes.DATE,
        allowNull: false
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
    tableName: 'NotificationFlashSales' 
});

// Thiết lập quan hệ giữa Notification và FlashSale
NotificationFlashSale.belongsTo(FlashSale, { foreignKey: 'flash_sale_id' });

module.exports = NotificationFlashSale;
