# Database Setup Guide

## Prerequisites
- PostgreSQL installed and running
- Node.js installed

## Setup Instructions

### 1. Install PostgreSQL
If you haven't installed PostgreSQL yet:
- Download from: https://www.postgresql.org/download/
- Install and remember your password

### 2. Create Database
Open PostgreSQL command line and run:
```sql
CREATE DATABASE amandeeo_loan;
```

### 3. Environment Configuration
Copy `.env.example` to `.env` and update with your database credentials:
```bash
cp .env.example .env
```

Edit `.env`:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=amandeeo_loan
DB_USER=postgres
DB_PASSWORD=your_postgres_password
PORT=3000
NODE_ENV=development
```

### 4. Install Dependencies
```bash
npm install
```

### 5. Start Server
```bash
node server.js
```

The server will automatically create tables and sync the database.

## Database Schema

### Users Table
- `id` - UUID primary key
- `firstName` - User's first name
- `lastName` - User's last name
- `email` - Unique email address
- `phone` - Phone number
- `address` - Street address
- `city` - City
- `state` - State/Province
- `zipCode` - Zip/Postal code

### Loans Table
- `id` - UUID primary key
- `userId` - Foreign key to Users
- `loanAmount` - Loan amount in currency
- `interestRate` - Annual interest rate
- `loanTerm` - Loan term in months
- `status` - pending, approved, rejected, active, completed
- `startDate` - Loan start date
- `endDate` - Loan end date
- `monthlyPayment` - Calculated monthly payment
- `description` - Loan description

## API Endpoints

### Users
- `POST /api/users` - Create new user
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user with loans

### Loans
- `POST /api/loans` - Create new loan
- `GET /api/loans` - Get all loans
- `GET /api/users/:userId/loans` - Get user's loans

## Models Location
- `models/User.js` - User model
- `models/Loan.js` - Loan model
- `models/index.js` - Model exports

## Connection Configuration
- `db/connection.js` - Sequelize connection
- `db/init.js` - Database initialization and sync

## Notes
- The `.env` file is excluded from version control (add to .gitignore)
- Models use automatic timestamps (createdAt, updatedAt)
- Foreign key relationships are automatically managed
