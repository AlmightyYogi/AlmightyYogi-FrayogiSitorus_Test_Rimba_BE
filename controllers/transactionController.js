const { Transaction, Product, User } = require('../models');
const crypto = require('crypto');

exports.createTransaction = async (req, res) => {
  const { customer, product } = req.body;
  const userId = req.user.id;

  const generateInvoiceNo = () => {
    const monthYear = new Date().toISOString().slice(0, 7).replace('-', '');
    const randomCode = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `INV-${randomCode}-${monthYear}`;
  };

  try {
    const invoiceNo = generateInvoiceNo();
    
    let totalAmount = 0;

    const productIds = product.map(p => p.productCode);
    const products = await Product.findAll({
      where: { productCode: productIds }
    });

    const missingProductCodes = productIds.filter(
      productCode => !products.some(product => product.productCode === productCode)
    );

    if (missingProductCodes.length > 0) {
      return res.status(400).json({
        requestId: null,
        data: null,
        message: `Product(s) with code(s) ${missingProductCodes.join(', ')} not found`,
        success: false,
      });
    }

    product.forEach(p => {
      const productItem = products.find(product => product.productCode === p.productCode);
      if (productItem) {
        totalAmount += productItem.price * p.quantity;
      }
    });

    const transaction = await Transaction.create({
      invoiceNo,
      customer,
      date: new Date(),
      userId,
      totalAmount,
    });

    await transaction.addProducts(products);

    res.status(201).json({
      requestId: transaction.id,
      data: transaction,
      message: 'Transaction created successfully',
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      requestId: null,
      data: null,
      message: error.message,
      success: false,
    });
  }
};

exports.listTransactions = async (req, res) => {
    const userId = req.user.id;

    try {
        const transactions = await Transaction.findAll({
            where: { userId },
            include: [{ model: Product }, { model: User }],
        });

        res.json({
            requestId: userId,
            data: transactions,
            message: 'Transactions fetched successfully',
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

exports.deleteTransaction = async (req, res) => {
    const { id } = req.params;

    try {
        const transaction = await Transaction.findByPk(id);
        if (!transaction) {
            return res.status(404).json({
                requestId: id,
                data: null,
                message: 'Transaction not found',
                success: false
            });
        }

        await transaction.removeProducts(await transaction.getProducts());
        await transaction.destroy();

        res.status(200).json({
            requestId: id,
            data: transaction,
            message: 'Transaction deleted successfully',
            success: true
        });
    } catch (error) {
        res.status(500).json({
            requestId: null,
            data: null,
            message: error.message,
            success: false
        });
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
          return res.status(404).json({
              message: 'No transactions found for this user',
              success: false,
          });
      }

      const summary = transactions.map(transaction => {
          const products = transaction.Products.map(product => ({
              productCode: product.productCode,
              productName: product.name,
              price: product.price,
              productId: product.id,  // Include product ID
              quantity: product.TransactionProducts.quantity,
              totalAmount: product.price * product.TransactionProducts.quantity,
          }));

          return {
              id: transaction.id, // Include transaction ID
              invoiceNo: transaction.invoiceNo,
              customer: transaction.customer,
              date: transaction.date,
              products: products,
              totalAmount: transaction.totalAmount,
          };
      });

      res.status(200).json({
          data: summary,
          success: true,
      });
  } catch (error) {
      res.status(500).json({
          message: error.message,
          success: false,
      });
  }
};