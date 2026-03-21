const express = require('express');
const { Payment, Loan, User, Transaction } = require('../models');
const { validatePayment } = require('../middleware/validation');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Create a new payment
router.post('/', authMiddleware, validatePayment, async (req, res) => {
  try {
    const { loanId, amount, paymentMethod, notes } = req.body;

    // Get loan to check authorization
    const loan = await Loan.findByPk(loanId);
    if (!loan) return res.status(404).json({ error: 'Loan not found' });

    // Users can only make payments for their own loans
    if (req.user.id !== loan.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Generate transaction ID
    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const payment = await Payment.create({
      loanId,
      amount,
      paymentMethod,
      transactionId,
      notes,
      status: 'completed',
    });

    // Create transaction record
    await Transaction.create({
      userId: loan.userId,
      loanId,
      type: 'debit',
      amount,
      description: `Payment for loan ${loanId}`,
      status: 'completed',
      reference: transactionId,
    });

    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all payments
router.get('/', authMiddleware, async (req, res) => {
  try {
    let query = {
      include: [{ model: Loan }],
    };

    // Non-admin users only see their payments
    if (req.user.role !== 'admin') {
      query.include.push({
        model: Loan,
        where: { userId: req.user.id },
      });
    }

    const payments = await Payment.findAll(query);
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get payments by loan
router.get('/loan/:loanId', authMiddleware, async (req, res) => {
  try {
    const loan = await Loan.findByPk(req.params.loanId);
    if (!loan) return res.status(404).json({ error: 'Loan not found' });

    // Check authorization
    if (req.user.id !== loan.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const payments = await Payment.findAll({
      where: { loanId: req.params.loanId },
      include: [{ model: Loan }],
      order: [['paymentDate', 'DESC']],
    });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get payment by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id, {
      include: [{ model: Loan }],
    });

    if (!payment) return res.status(404).json({ error: 'Payment not found' });

    // Check authorization
    if (req.user.id !== payment.Loan.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update payment (admin only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ error: 'Payment not found' });

    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await payment.update(req.body);
    res.json(payment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
