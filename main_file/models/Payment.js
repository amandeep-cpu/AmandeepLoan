const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');
const Loan = require('./Loan');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  loanId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Loan,
      key: 'id',
    },
  },
  amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  paymentDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  paymentMethod: {
    type: DataTypes.ENUM('bank_transfer', 'credit_card', 'debit_card', 'check', 'cash'),
    defaultValue: 'bank_transfer',
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed', 'cancelled'),
    defaultValue: 'pending',
  },
  transactionId: {
    type: DataTypes.STRING,
    unique: true,
  },
  notes: {
    type: DataTypes.TEXT,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'payments',
  timestamps: true,
});

// Define relationships
Payment.belongsTo(Loan, { foreignKey: 'loanId' });
Loan.hasMany(Payment, { foreignKey: 'loanId' });

module.exports = Payment;
