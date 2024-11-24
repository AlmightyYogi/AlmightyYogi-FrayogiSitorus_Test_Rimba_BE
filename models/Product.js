const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Product = sequelize.define('Product', {
    name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    description: { type: DataTypes.STRING },
    quantity: { type: DataTypes.STRING, allowNull: false },
    productCode: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

Product.belongsTo(User, { foreignKey: 'userId' });

module.exports = Product;