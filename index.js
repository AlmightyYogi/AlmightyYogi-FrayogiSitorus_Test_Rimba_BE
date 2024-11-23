require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { connectDB } = require('./config/database');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const transactionRoutes = require('./routes/transaction');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to Database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/transactions', transactionRoutes);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

module.exports = app;
