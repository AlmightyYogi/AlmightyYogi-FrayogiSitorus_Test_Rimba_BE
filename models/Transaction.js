const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Transaction = sequelize.define('Transaction', {
    invoiceNo: { type: DataTypes.STRING, allowNull: false },
    customer: { type: DataTypes.STRING, allowNull: false },
    totalAmount: { type: DataTypes.FLOAT, allowNull: false },
    date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    deletedAt: { type: DataTypes.DATE, allowNull: true },
}, {
    timestamps: true,
    paranoid: true,
});

module.exports = Transaction;
