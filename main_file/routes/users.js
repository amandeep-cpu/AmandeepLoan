const express = require('express');
const { User, Loan, Payment, Transaction } = require('../models');
const { validateUser } = require('../middleware/validation');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();

// Create a new user (admin only)
router.post('/', authMiddleware, roleMiddleware(['admin']), validateUser, async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all users (admin only)
router.get('/', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        { model: Loan },
        { model: Transaction },
      ],
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    // Users can only view their own profile, admins can view any
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const user = await User.findByPk(req.params.id, {
      include: [
        { model: Loan },
        { model: Payment },
        { model: Transaction },
      ],
    });
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    // Users can only update their own profile
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.update(req.body);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete user (admin only)
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
