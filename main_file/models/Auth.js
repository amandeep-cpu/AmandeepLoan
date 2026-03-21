const { DataTypes } = require('sequelize');
const sequelize = require('../db/connection');
const bcrypt = require('bcryptjs');
const User = require('./User');

const Auth = sequelize.define('Auth', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    references: {
      model: User,
      key: 'id',
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('user', 'admin', 'staff'),
    defaultValue: 'user',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  lastLogin: {
    type: DataTypes.DATE,
  },
  loginAttempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  lockedUntil: {
    type: DataTypes.DATE,
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
  tableName: 'auth',
  timestamps: true,
});

// Hash password before saving
Auth.beforeCreate(async (auth) => {
  const salt = await bcrypt.genSalt(10);
  auth.password = await bcrypt.hash(auth.password, salt);
});

// Method to validate password
Auth.prototype.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Define relationships
Auth.belongsTo(User, { foreignKey: 'userId' });
User.hasOne(Auth, { foreignKey: 'userId' });

module.exports = Auth;
