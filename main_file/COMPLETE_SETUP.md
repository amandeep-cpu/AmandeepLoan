# AmandeeoLoan Complete Setup Guide

## Project Structure

```
main_file/
├── config/
│   └── swagger.js              # Swagger/OpenAPI configuration
├── db/
│   ├── connection.js           # Database connection
│   └── init.js                 # Database initialization
├── middleware/
│   ├── auth.js                 # Authentication middleware
│   └── validation.js           # Input validation middleware
├── models/
│   ├── User.js                 # User model
│   ├── Loan.js                 # Loan model
│   ├── Payment.js              # Payment model
│   ├── Transaction.js          # Transaction model
│   ├── Auth.js                 # Authentication/Password model
│   └── index.js                # Model exports
├── routes/
│   ├── auth.js                 # Authentication routes
│   ├── users.js                # User management routes
│   ├── loans.js                # Loan management routes
│   ├── payments.js             # Payment routes
│   └── transactions.js         # Transaction routes
├── server.js                   # Main application file
├── package.json                # Project dependencies
├── .env.example                # Environment variables template
├── DATABASE_SETUP.md           # Database setup guide
├── API_DOCUMENTATION.md        # Complete API documentation
└── test_api.sh                 # API testing script
```

## Prerequisites

- Node.js (v14+)
- PostgreSQL (v12+)
- npm or yarn

## Installation Steps

### 1. Install Dependencies

```bash
cd main_file
npm install
```

This installs all required packages:
- **express** - Web framework
- **sequelize** - ORM for database
- **pg, pg-hstore** - PostgreSQL drivers
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **express-validator** - Input validation
- **cors** - Cross-Origin Resource Sharing
- **helmet** - Security headers
- **dotenv** - Environment variables
- **swagger-ui-express, swagger-jsdoc** - API documentation

### 2. Configure Environment

```bash
# Copy example file
cp .env.example .env

# Edit .env with your database credentials
```

**Sample .env:**
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=amandeeo_loan
DB_USER=postgres
DB_PASSWORD=your_postgres_password
PORT=3000
NODE_ENV=development
JWT_SECRET=your_super_secret_key
```

### 3. Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE amandeeo_loan;

# Exit
\q
```

Or use pgAdmin GUI to create the database.

### 4. Start the Server

```bash
node server.js
```

Expected output:
```
✓ Database connection successful
✓ Database models synced
✓ Database initialization complete
✓ Server running on http://localhost:3000
✓ API Documentation available at http://localhost:3000/api-docs
✓ Environment: development
```

## Features

### Authentication System
- **User Registration** - Sign up with email and password
- **Login** - Get JWT token
- **Password Management** - Secure password hashing with bcryptjs
- **Account Security** - Account lockout after 5 failed attempts
- **Role-Based Access** - User, Admin, Staff roles

### User Management
- Create user profiles
- Update personal information
- View profile and linked loans
- Admin can manage all users

### Loan Management
- Create loan applications
- Automatic monthly payment calculation
- Track loan status (pending, approved, active, completed)
- View loan details with payment history

### Payment Processing
- Record loan payments
- Multiple payment methods (bank transfer, credit card, debit card, check, cash)
- Payment status tracking
- Automatic transaction logging

### Transaction System
- Track all financial transactions
- Multiple transaction types (credit, debit, fee, interest, penalty, refund)
- Transaction history by user and loan
- Generate transaction statistics

### API Documentation
- **Swagger UI** - Interactive API explorer at `/api-docs`
- **Complete Documentation** - See `API_DOCUMENTATION.md`
- **Example Requests** - Curl examples in documentation

### Security Features
- JWT-based authentication
- Password encryption (bcryptjs)
- CORS protection
- Helmet security headers
- Input validation (express-validator)
- Role-based access control
- SQL injection prevention (via Sequelize)

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/change-password` - Change password
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin only)

### Loans
- `POST /api/loans` - Create loan
- `GET /api/loans` - Get all loans
- `GET /api/loans/:id` - Get loan details
- `PUT /api/loans/:id` - Update loan
- `DELETE /api/loans/:id` - Delete loan (admin only)

### Payments
- `POST /api/payments` - Create payment
- `GET /api/payments` - Get all payments
- `GET /api/payments/loan/:loanId` - Get loan payments
- `GET /api/payments/:id` - Get payment details
- `PUT /api/payments/:id` - Update payment (admin only)

### Transactions
- `GET /api/transactions` - Get all transactions (admin only)
- `GET /api/transactions/user/:userId` - Get user transactions
- `GET /api/transactions/loan/:loanId` - Get loan transactions
- `GET /api/transactions/stats/summary` - Get statistics (admin only)

## Quick Start Examples

### 1. Register a User
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "phone": "+1234567890"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

Save the returned token for authenticated requests.

### 3. Create a Loan
```bash
curl -X POST http://localhost:3000/api/loans \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_uuid",
    "loanAmount": 10000,
    "interestRate": 8.5,
    "loanTerm": 36,
    "description": "Business expansion loan"
  }'
```

### 4. Record Payment
```bash
curl -X POST http://localhost:3000/api/payments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "loanId": "loan_uuid",
    "amount": 316.49,
    "paymentMethod": "bank_transfer",
    "notes": "Monthly payment"
  }'
```

## Database Models

### User
- id (UUID, Primary Key)
- firstName (String)
- lastName (String)
- email (String, Unique)
- phone (String)
- address (Text)
- city (String)
- state (String)
- zipCode (String)
- timestamps

### Auth
- id (UUID, Primary Key)
- userId (UUID, Foreign Key)
- password (String, Hashed)
- role (Enum: user, admin, staff)
- isActive (Boolean)
- lastLogin (DateTime)
- loginAttempts (Integer)
- lockedUntil (DateTime)

### Loan
- id (UUID, Primary Key)
- userId (UUID, Foreign Key)
- loanAmount (Decimal)
- interestRate (Decimal)
- loanTerm (Integer, months)
- status (Enum: pending, approved, rejected, active, completed)
- startDate (DateTime)
- endDate (DateTime)
- monthlyPayment (Decimal)
- description (Text)

### Payment
- id (UUID, Primary Key)
- loanId (UUID, Foreign Key)
- amount (Decimal)
- paymentDate (DateTime)
- paymentMethod (Enum)
- status (Enum: pending, completed, failed, cancelled)
- transactionId (String, Unique)
- notes (Text)

### Transaction
- id (UUID, Primary Key)
- userId (UUID, Foreign Key)
- loanId (UUID, Foreign Key)
- type (Enum: credit, debit, fee, interest, penalty, refund)
- amount (Decimal)
- description (Text)
- status (Enum: pending, completed, failed, reversed)
- reference (String, Unique)
- metadata (JSON)

## Troubleshooting

### Database Connection Error
- Verify PostgreSQL is running
- Check .env credentials
- Ensure database exists: `createdb amandeeo_loan`

### Missing JWT Token
- All protected endpoints require `Authorization: Bearer <token>` header
- Get token from login/signup endpoint

### Validation Errors
- Check request body matches API documentation
- See error messages for specific field issues

### Port Already in Use
- Change PORT in .env file
- Or: `lsof -i :3000` and kill process

## Development

### Running Tests
```bash
# Run API test script (requires bash/WSL)
bash test_api.sh
```

### Debugging
Enable detailed logging by setting `NODE_ENV=development` in .env

### Database Reset
To reset database and start fresh:
```sql
DROP DATABASE amandeeo_loan;
CREATE DATABASE amandeeo_loan;
```

## Deployment

### Production Setup
1. Change `NODE_ENV=production`
2. Set strong `JWT_SECRET`
3. Configure production PostgreSQL
4. Use environment variable management (PM2, Docker)
5. Set up HTTPS/SSL
6. Configure CORS for production domain

### Using PM2
```bash
npm install -g pm2
pm2 start server.js --name amandeeo-loan
pm2 save
pm2 startup
```

## Documentation

- **API_DOCUMENTATION.md** - Complete REST API documentation
- **DATABASE_SETUP.md** - Database setup guide
- **Swagger UI** - Interactive API docs at `/api-docs`

## Security Best Practices

1. ✓ Never commit .env file
2. ✓ Use strong passwords
3. ✓ Rotate JWT_SECRET regularly
4. ✓ Keep dependencies updated
5. ✓ Use HTTPS in production
6. ✓ Implement rate limiting
7. ✓ Regular database backups
8. ✓ Log all transactions

## Support & Contact

For issues or questions:
- Check API documentation
- Review error logs
- Check database integrity
- Contact: support@amandeeo.com

---

**Created:** 2024
**Version:** 1.0.0
**Status:** Production Ready
