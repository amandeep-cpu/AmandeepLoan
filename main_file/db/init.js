const sequelize = require('./db/connection');
const { User, Loan } = require('./models');

const initializeDatabase = async () => {
  try {
    console.log('Testing database connection...');
    await sequelize.authenticate();
    console.log('✓ Database connection successful');

    console.log('Syncing database models...');
    await sequelize.sync({ alter: true });
    console.log('✓ Database models synced');

    console.log('✓ Database initialization complete');
  } catch (error) {
    console.error('✗ Database initialization failed:', error);
    process.exit(1);
  }
};

module.exports = initializeDatabase;
