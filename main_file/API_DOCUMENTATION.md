# AmandeeoLoan API Documentation

## Overview
Complete REST API for the AmandeeoLoan application with authentication, user management, loan management, payments, and transaction tracking.

## Base URL
```
http://localhost:3000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## API Documentation
Interactive API documentation is available at:
```
http://localhost:3000/api-docs
```

---

## Authentication Endpoints

### Register (Signup)
**POST** `/auth/signup`

Create a new user account.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePassword123",
  "phone": "+1234567890"
}
```

**Response:** `201 Created`
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
  },
  "token": "jwt_token"
}
```

---

### Login
**POST** `/auth/login`

Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response:** `200 OK`
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
  },
  "token": "jwt_token"
}
```

---

### Get Current User
**GET** `/auth/me`

Get authenticated user's profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "role": "user"
  }
}
```

---

### Change Password
**POST** `/auth/change-password`

Change user's password.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "oldPassword": "OldPassword123",
  "newPassword": "NewPassword123"
}
```

**Response:** `200 OK`
```json
{
  "message": "Password changed successfully"
}
```

---

## User Endpoints

### Get All Users
**GET** `/users`

Get all users (admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Main St",
    "city": "Springfield",
    "state": "IL",
    "zipCode": "62701"
  }
]
```

---

### Get User by ID
**GET** `/users/:id`

Get specific user details with loans and transactions.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "Loans": [
    {
      "id": "uuid",
      "loanAmount": 5000,
      "interestRate": 12.5,
      "status": "active"
    }
  ],
  "Transactions": []
}
```

---

### Update User Profile
**PUT** `/users/:id`

Update user information.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "firstName": "Jane",
  "phone": "+0987654321",
  "address": "456 Oak Ave"
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+0987654321",
  "address": "456 Oak Ave"
}
```

---

### Delete User
**DELETE** `/users/:id`

Delete user account (admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:** `200 OK`
```json
{
  "message": "User deleted successfully"
}
```

---

## Loan Endpoints

### Create Loan
**POST** `/loans`

Create a new loan application.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "userId": "user_uuid",
  "loanAmount": 10000,
  "interestRate": 8.5,
  "loanTerm": 36,
  "description": "Business expansion loan"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "userId": "user_uuid",
  "loanAmount": 10000,
  "interestRate": 8.5,
  "loanTerm": 36,
  "monthlyPayment": 316.49,
  "status": "pending"
}
```

---

### Get All Loans
**GET** `/loans`

Get all loans (users see only their own).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "userId": "user_uuid",
    "loanAmount": 10000,
    "interestRate": 8.5,
    "loanTerm": 36,
    "monthlyPayment": 316.49,
    "status": "active",
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": "2027-01-01T00:00:00Z"
  }
]
```

---

### Get Loan by ID
**GET** `/loans/:id`

Get specific loan details.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "userId": "user_uuid",
  "loanAmount": 10000,
  "interestRate": 8.5,
  "loanTerm": 36,
  "monthlyPayment": 316.49,
  "status": "active",
  "Payments": [],
  "User": {
    "id": "user_uuid",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

---

### Update Loan
**PUT** `/loans/:id`

Update loan details.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "completed",
  "description": "Updated description"
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "status": "completed"
}
```

---

### Delete Loan
**DELETE** `/loans/:id`

Delete loan (admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:** `200 OK`
```json
{
  "message": "Loan deleted successfully"
}
```

---

## Payment Endpoints

### Create Payment
**POST** `/payments`

Record a loan payment.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "loanId": "loan_uuid",
  "amount": 316.49,
  "paymentMethod": "bank_transfer",
  "notes": "Monthly payment"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "loanId": "loan_uuid",
  "amount": 316.49,
  "paymentDate": "2024-03-21T00:00:00Z",
  "paymentMethod": "bank_transfer",
  "status": "completed",
  "transactionId": "TXN-123456789"
}
```

---

### Get All Payments
**GET** `/payments`

Get all payments (users see only their payments).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "loanId": "loan_uuid",
    "amount": 316.49,
    "paymentDate": "2024-03-21T00:00:00Z",
    "paymentMethod": "bank_transfer",
    "status": "completed"
  }
]
```

---

### Get Payments by Loan
**GET** `/payments/loan/:loanId`

Get all payments for a specific loan.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "loanId": "loan_uuid",
    "amount": 316.49,
    "paymentDate": "2024-03-21T00:00:00Z",
    "paymentMethod": "bank_transfer",
    "status": "completed"
  }
]
```

---

## Transaction Endpoints

### Get User Transactions
**GET** `/transactions/user/:userId`

Get all transactions for a user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "userId": "user_uuid",
    "loanId": "loan_uuid",
    "type": "debit",
    "amount": 316.49,
    "description": "Payment for loan",
    "status": "completed",
    "reference": "TXN-123456789"
  }
]
```

---

### Get Loan Transactions
**GET** `/transactions/loan/:loanId`

Get all transactions for a loan.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "userId": "user_uuid",
    "loanId": "loan_uuid",
    "type": "debit",
    "amount": 316.49,
    "description": "Payment for loan",
    "status": "completed"
  }
]
```

---

### Get Transaction Stats
**GET** `/transactions/stats/summary`

Get transaction statistics (admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:** `200 OK`
```json
{
  "totalTransactions": 150,
  "totalAmount": 47500.50,
  "byType": [
    {
      "type": "debit",
      "count": "100",
      "total": "31665.00"
    },
    {
      "type": "credit",
      "count": "50",
      "total": "15835.50"
    }
  ]
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "errors": [
    {
      "msg": "Valid email is required",
      "param": "email"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid token"
}
```

### 403 Forbidden
```json
{
  "error": "Not authorized"
}
```

### 404 Not Found
```json
{
  "error": "User not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "Error details"
}
```

---

## User Roles

- **user**: Regular user (can view own data)
- **admin**: Administrator (full access)
- **staff**: Staff member (can manage loans)

---

## Security Features

- JWT Authentication
- Password Hashing (bcryptjs)
- CORS Protection
- Helmet Security Headers
- Input Validation
- Account Lockout (5 failed attempts = 15 min lockout)
- Role-based Access Control

---

## Example Usage

### Signup and Login
```bash
# Signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Create Loan
```bash
curl -X POST http://localhost:3000/api/loans \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_uuid",
    "loanAmount": 10000,
    "interestRate": 8.5,
    "loanTerm": 36
  }'
```

### Record Payment
```bash
curl -X POST http://localhost:3000/api/payments \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "loanId": "loan_uuid",
    "amount": 316.49,
    "paymentMethod": "bank_transfer"
  }'
```

---

## Environment Variables

Update `.env` file:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=amandeeo_loan
DB_USER=postgres
DB_PASSWORD=your_password
PORT=3000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key
```

---

## Support

For issues or questions, contact support@amandeeo.com
