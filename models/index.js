const { sequelize } = require('../config/database');
const User = require('./User');
const Product = require('./Product');
const Transaction = require('./Transaction');

User.hasMany(Transaction, { foreignKey: 'userId' });
Transaction.belongsTo(User, { foreignKey: 'userId' });

Transaction.belongsToMany(Product, { through: 'TransactionProducts' });
Product.belongsToMany(Transaction, { through: 'TransactionProducts' });

sequelize.sync({ alter: true })
    .then(() => console.log('Models synchronized with MYSQL'))
    .catch(err => console.log('Failed to sync models:', err));

module.exports = { User, Product, Transaction };