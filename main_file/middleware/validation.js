const { body, validationResult } = require('express-validator');

const validationMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validateUser = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number is required'),
  validationMiddleware,
];

const validateLoan = [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('loanAmount').isDecimal({ min: 0 }).withMessage('Valid loan amount is required'),
  body('interestRate').isDecimal({ min: 0, max: 100 }).withMessage('Interest rate must be between 0 and 100'),
  body('loanTerm').isInt({ min: 1 }).withMessage('Loan term must be at least 1 month'),
  validationMiddleware,
];

const validatePayment = [
  body('loanId').notEmpty().withMessage('Loan ID is required'),
  body('amount').isDecimal({ min: 0 }).withMessage('Valid amount is required'),
  body('paymentMethod').isIn(['bank_transfer', 'credit_card', 'debit_card', 'check', 'cash']).withMessage('Invalid payment method'),
  validationMiddleware,
];

const validateLogin = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validationMiddleware,
];

const validateSignup = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validationMiddleware,
];

module.exports = {
  validationMiddleware,
  validateUser,
  validateLoan,
  validatePayment,
  validateLogin,
  validateSignup,
};
