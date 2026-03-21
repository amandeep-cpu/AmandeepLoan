const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
const initializeDatabase = require('./db/init');

// Routes import
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const loanRoutes = require('./routes/loans');
const paymentRoutes = require('./routes/payments');
const transactionRoutes = require('./routes/transactions');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security Middleware
app.use(helmet());
app.use(cors());

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// Auth Routes
/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               phone: { type: string }
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Error in registration
 */
app.use('/api/auth', authRoutes);

// User Routes
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       401:
 *         description: Unauthorized
 */
app.use('/api/users', userRoutes);

// Loan Routes
/**
 * @swagger
 * /api/loans:
 *   get:
 *     summary: Get all loans
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of loans
 *       401:
 *         description: Unauthorized
 */
app.use('/api/loans', loanRoutes);

// Payment Routes
/**
 * @swagger
 * /api/payments:
 *   get:
 *     summary: Get all payments
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of payments
 */
app.use('/api/payments', paymentRoutes);

// Transaction Routes
/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Get all transactions (admin only)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of transactions
 */
app.use('/api/transactions', transactionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const startServer = async () => {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ API Documentation available at http://localhost:${PORT}/api-docs`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
