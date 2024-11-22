const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Transaction = sequelize.define('Transaction', {
    totalAmount: { type: DataTypes.FLOAT, allowNull: false },
    date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

module.exports = Transaction;