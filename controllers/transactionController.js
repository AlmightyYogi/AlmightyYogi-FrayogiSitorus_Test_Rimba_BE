const { Transaction, Product, User } = require('../models');

exports.createTransaction = async (req, res) => {
    const { productIds, userId, totalAmount } = req.body;

    try {
        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const transaction = await Transaction.create({ userId, totalAmount });
        const products= await Product.findAll({ where: { id: productIds } });

        await transaction.addProducts(products);

        res.status(201).json({ message: 'Transaction created successfully', transaction });
    } catch (error) {
        res.status(400).json({ message: 'Transaction creation failed', error: error.message });
    }
};

exports.listTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.findAll({ 
            include: [{ model: Product }, { model: User }],
         });

         res.json({ message: 'Transactions fetched successfully', transactions });
    } catch(error) {
        res.status(500).json({ message: 'Failed to fetch transactions', error: error.message });
    }
};

exports.deleteTransaction = async (req, res) => {
    const { transactionId } = req.params;

    try {
        const transaction = await Transaction.findByPk(transactionId);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        await transaction.removeProducts(await transaction.getProducts());
        await transaction.destroy();

        res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete transaction', error: error.message });
    }
};

exports.getSummary = async (req, res) => {
    const userId = req.user.id;

    try {
        const transactions = await Transaction.findAll({
            where: { userId },
            include: [{ model: Product }],
        });

        if (transactions.length === 0) {
            return res.status(404).json({ message: 'No transactions found for this user' });
        }

        res.status(200).json({ message: 'Transactions summary fetched successfully', transactions });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch transaction summary', error: error.message });
    }
};