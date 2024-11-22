const { Product } = require('../models');

exports.createProduct = async (req, res) => {
    const { name, price, description } = req.body;

    try {
        const newProduct = await Product.create({ name, price, description });
        res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (error) {
        res.status(400).json({ message: 'Product creation failed', error: error.message });
    }
};

exports.listProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json({ message: 'Products fetched successfully', products });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch products', error: error.message });
    }
};