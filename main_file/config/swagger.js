const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AmandeeoLoan API Documentation',
      version: '1.0.0',
      description: 'Complete API documentation for AmandeeoLoan application',
      contact: {
        name: 'Support',
        email: 'support@amandeeo.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' },
            address: { type: 'string' },
            city: { type: 'string' },
            state: { type: 'string' },
            zipCode: { type: 'string' },
          },
        },
        Loan: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid' },
            loanAmount: { type: 'number', format: 'decimal' },
            interestRate: { type: 'number', format: 'decimal' },
            loanTerm: { type: 'integer' },
            status: { type: 'string', enum: ['pending', 'approved', 'rejected', 'active', 'completed'] },
            monthlyPayment: { type: 'number', format: 'decimal' },
          },
        },
        Payment: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            loanId: { type: 'string', format: 'uuid' },
            amount: { type: 'number', format: 'decimal' },
            paymentDate: { type: 'string', format: 'date-time' },
            paymentMethod: { type: 'string', enum: ['bank_transfer', 'credit_card', 'debit_card', 'check', 'cash'] },
            status: { type: 'string', enum: ['pending', 'completed', 'failed', 'cancelled'] },
          },
        },
        Transaction: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid' },
            loanId: { type: 'string', format: 'uuid' },
            type: { type: 'string', enum: ['credit', 'debit', 'fee', 'interest', 'penalty', 'refund'] },
            amount: { type: 'number', format: 'decimal' },
            description: { type: 'string' },
            status: { type: 'string', enum: ['pending', 'completed', 'failed', 'reversed'] },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [
    './routes/auth.js',
    './routes/users.js',
    './routes/loans.js',
    './routes/payments.js',
    './routes/transactions.js',
  ],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
