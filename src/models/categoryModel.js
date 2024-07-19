const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig')

const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    parent_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Categories',
            key: 'id'
        }
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    position: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    banner_image: {
        type: DataTypes.STRING(255),
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active'
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
    tableName: 'Categories'
});

Category.belongsTo(Category, { as: 'parent', foreignKey: 'parent_id' });
Category.hasMany(Category, { as: 'children', foreignKey: 'parent_id' });

module.exports = Category;
