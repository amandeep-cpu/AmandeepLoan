const express = require('express');
const jwt = require('jsonwebtoken');
const { User, Auth } = require('../models');
const { validateLogin, validateSignup } = require('../middleware/validation');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Register/Signup
router.post('/signup', validateSignup, async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
    });

    // Create auth record
    const auth = await Auth.create({
      userId: user.id,
      password,
      role: 'user',
    });

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: auth.role },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user.id, firstName, lastName, email },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Find auth record
    const auth = await Auth.findOne({ where: { userId: user.id } });
    if (!auth) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if active
    if (!auth.isActive) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    // Check if locked
    if (auth.lockedUntil && new Date() < auth.lockedUntil) {
      return res.status(401).json({ error: 'Account is locked. Try again later' });
    }

    // Validate password
    const isValidPassword = await auth.validatePassword(password);
    if (!isValidPassword) {
      auth.loginAttempts += 1;
      if (auth.loginAttempts >= 5) {
        auth.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // Lock for 15 minutes
      }
      await auth.save();
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Reset login attempts and update last login
    auth.loginAttempts = 0;
    auth.lockedUntil = null;
    auth.lastLogin = new Date();
    await auth.save();

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: auth.role },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    const auth = await Auth.findOne({ where: { userId: req.user.id } });

    res.json({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: auth.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Logout
router.post('/logout', authMiddleware, (req, res) => {
  // In a real app, you might invalidate tokens by storing them in a blacklist
  res.json({ message: 'Logged out successfully' });
});

// Change password
router.post('/change-password', authMiddleware, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const auth = await Auth.findOne({ where: { userId: req.user.id } });
    const isValid = await auth.validatePassword(oldPassword);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid current password' });
    }

    auth.password = newPassword;
    await auth.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
