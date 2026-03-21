const express = require('express');
const { Transaction, User, Loan } = require('../models');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get all transactions (admin only)
router.get('/', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      include: [
        { model: User },
        { model: Loan },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user transactions
router.get('/user/:userId', authMiddleware, async (req, res) => {
  try {
    // Users can only view their own transactions
    if (req.user.id !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const transactions = await Transaction.findAll({
      where: { userId: req.params.userId },
      include: [
        { model: User },
        { model: Loan },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get loan transactions
router.get('/loan/:loanId', authMiddleware, async (req, res) => {
  try {
    const loan = await Loan.findByPk(req.params.loanId);
    if (!loan) return res.status(404).json({ error: 'Loan not found' });

    // Check authorization
    if (req.user.id !== loan.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const transactions = await Transaction.findAll({
      where: { loanId: req.params.loanId },
      include: [
        { model: User },
        { model: Loan },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get transaction stats (admin only)
router.get('/stats/summary', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const totalTransactions = await Transaction.count();
    const totalAmount = await Transaction.sum('amount');
    const transactionsByType = await Transaction.findAll({
      attributes: ['type', [sequelize.fn('COUNT', sequelize.col('id')), 'count'], [sequelize.fn('SUM', sequelize.col('amount')), 'total']],
      group: ['type'],
      raw: true,
    });

    res.json({
      totalTransactions,
      totalAmount,
      byType: transactionsByType,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
