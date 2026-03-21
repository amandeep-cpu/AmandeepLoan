const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');
const User = require('./User');
const Loan = require('./Loan');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  loanId: {
    type: DataTypes.UUID,
    references: {
      model: Loan,
      key: 'id',
    },
  },
  type: {
    type: DataTypes.ENUM('credit', 'debit', 'fee', 'interest', 'penalty', 'refund'),
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed', 'reversed'),
    defaultValue: 'pending',
  },
  reference: {
    type: DataTypes.STRING,
    unique: true,
  },
  metadata: {
    type: DataTypes.JSON,
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
  tableName: 'transactions',
  timestamps: true,
});

// Define relationships
Transaction.belongsTo(User, { foreignKey: 'userId' });
Transaction.belongsTo(Loan, { foreignKey: 'loanId' });
User.hasMany(Transaction, { foreignKey: 'userId' });

module.exports = Transaction;
