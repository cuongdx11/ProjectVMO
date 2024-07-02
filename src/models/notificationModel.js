const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig'); // Cập nhật đường dẫn cho đúng
const FlashSale = require('./flashsaleModel'); // Import model FlashSale để thiết lập quan hệ

const Notification = sequelize.define('Notification', {
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
    tableName: 'Notifications'
});

// Thiết lập quan hệ giữa Notification và FlashSale
Notification.belongsTo(FlashSale, { foreignKey: 'flash_sale_id' });

module.exports = Notification;
