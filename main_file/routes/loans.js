const express = require('express');
const { Loan, User, Payment } = require('../models');
const { validateLoan } = require('../middleware/validation');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();

// Create a new loan
router.post('/', authMiddleware, validateLoan, async (req, res) => {
  try {
    const { userId, loanAmount, interestRate, loanTerm } = req.body;

    // Users can only create loans for themselves
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Calculate monthly payment
    const monthlyRate = interestRate / 100 / 12;
    const monthlyPayment = monthlyRate === 0 
      ? loanAmount / loanTerm
      : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / 
        (Math.pow(1 + monthlyRate, loanTerm) - 1);

    const loan = await Loan.create({
      userId,
      loanAmount,
      interestRate,
      loanTerm,
      monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
    });

    res.status(201).json(loan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all loans
router.get('/', authMiddleware, async (req, res) => {
  try {
    let where = {};

    // Non-admin users can only see their own loans
    if (req.user.role !== 'admin') {
      where.userId = req.user.id;
    }

    const loans = await Loan.findAll({
      where,
      include: [
        { model: User },
        { model: Payment },
      ],
    });
    res.json(loans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get loan by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const loan = await Loan.findByPk(req.params.id, {
      include: [
        { model: User },
        { model: Payment },
      ],
    });

    if (!loan) return res.status(404).json({ error: 'Loan not found' });

    // Users can only view their own loans
    if (req.user.id !== loan.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.json(loan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update loan
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const loan = await Loan.findByPk(req.params.id);
    if (!loan) return res.status(404).json({ error: 'Loan not found' });

    // Only admins or the loan owner can update
    if (req.user.id !== loan.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Recalculate monthly payment if amounts change
    if (req.body.loanAmount || req.body.interestRate || req.body.loanTerm) {
      const loanAmount = req.body.loanAmount || loan.loanAmount;
      const interestRate = req.body.interestRate || loan.interestRate;
      const loanTerm = req.body.loanTerm || loan.loanTerm;

      const monthlyRate = interestRate / 100 / 12;
      const monthlyPayment = monthlyRate === 0 
        ? loanAmount / loanTerm
        : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / 
          (Math.pow(1 + monthlyRate, loanTerm) - 1);

      req.body.monthlyPayment = parseFloat(monthlyPayment.toFixed(2));
    }

    await loan.update(req.body);
    res.json(loan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete loan (admin only)
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const loan = await Loan.findByPk(req.params.id);
    if (!loan) return res.status(404).json({ error: 'Loan not found' });

    await loan.destroy();
    res.json({ message: 'Loan deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
