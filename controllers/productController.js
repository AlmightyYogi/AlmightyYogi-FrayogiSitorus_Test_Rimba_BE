const { Product } = require('../models');
const crypto = require('crypto');

exports.createProduct = async (req, res) => {
    const { productName, price, description } = req.body;
    const userId = req.user.id;

    const generateProductCode = () => {
        return 'ECM-' + crypto.randomBytes(3).toString('hex').toUpperCase();
    };

    const date = req.body.date || new Date();

    try {
        const productCode = generateProductCode();

        const newProduct = await Product.create({
            name: productName,
            date,
            productCode,
            price,
            quantity: req.body.quantity,
            description,
            userId,
        });

        res.status(201).json({
            requestId: userId,
            data: newProduct,
            message: 'Product created successfully',
            success: true,
        });
    } catch (error) {
        res.status(400).json({
            requestId: userId,
            data: null,
            message: error.message,
            success: false,
        });
    }
};

exports.listProducts = async (req, res) => {
    const userId = req.user.id;

    try {
        const products = await Product.findAll({ where: { userId } });

        res.json({
            requestId: userId,
            data: products,
            message: "Products fetched successfully",
            success: true,
        });
    } catch (error) {
        res.status(500).json({
            requestId: userId,
            data: null,
            message: error.message,
            success: false,
        });
    }
};
