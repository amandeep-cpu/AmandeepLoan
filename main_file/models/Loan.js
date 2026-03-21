const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');
const User = require('./User');

const Loan = sequelize.define('Loan', {
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
  loanAmount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  interestRate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
  },
  loanTerm: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Loan term in months',
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'active', 'completed'),
    defaultValue: 'pending',
  },
  startDate: {
    type: DataTypes.DATE,
  },
  endDate: {
    type: DataTypes.DATE,
  },
  monthlyPayment: {
    type: DataTypes.DECIMAL(12, 2),
  },
  description: {
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
  tableName: 'loans',
  timestamps: true,
});

// Define relationships
Loan.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Loan, { foreignKey: 'userId' });

module.exports = Loan;
