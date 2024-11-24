const express = require('express');
const { createTransaction, listTransactions, deleteTransaction, getSummary } = require('../controllers/transactionController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, createTransaction);
router.get('/', authMiddleware, listTransactions);
router.delete('/:id', authMiddleware, deleteTransaction);
router.get('/summary', authMiddleware, getSummary);

module.exports = router;
