const express = require('express');
const { createProduct, listProducts } = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, createProduct);
router.get('/', authMiddleware, listProducts);

module.exports = router;