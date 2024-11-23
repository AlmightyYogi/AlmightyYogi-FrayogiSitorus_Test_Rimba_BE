const mysql2 = require('mysql2');
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        dialectModule: mysql2,
        logging: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 60000,
            idle: 10000,
        },
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to MySQL database successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error.message);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };
