# AmandeepLoan - Full-Stack Loan Management System

A professional loan management system with a modern Node.js backend and responsive frontend. Features comprehensive loan tracking, analytics, and reporting capabilities.

> **Note**: Flutter components have been removed from this project. This is now a pure web-based application using HTML, CSS, JavaScript, and Node.js.

## Features

- ✅ **Full-Stack Architecture** - Node.js/Express backend with RESTful API
- ✅ **Add New Loans** - Create loan applications with borrower details
- ✅ **View Loan Details** - Track payments and loan progress
- ✅ **Dashboard Analytics** - Visual charts and key metrics
- ✅ **Financial Reports** - Comprehensive reporting and export
- ✅ **Payment Tracking** - Record and monitor loan payments
- ✅ **Data Persistence** - JSON file-based storage
- ✅ **Professional Design** - Modern UI with responsive layout
- ✅ **Real-time Calculations** - Automatic loan calculations
- ✅ **Performance Optimized** - Compression, caching, and fast responses
- ✅ **Health Monitoring** - Built-in health check endpoint

## How to Run

### Quick Start (Recommended)
1. Download or clone this repository
2. Navigate to the project folder
3. Run the startup script:
   - **Windows**: Double-click `run.bat`
   - **Linux/Mac**: Run `./run.sh` (make sure it's executable: `chmod +x run.sh`)

### Manual Start
1. Install dependencies: `npm install`
2. Start the server: `npm start` or `node server.js`
3. Open your browser to `http://localhost:3000`

## API Endpoints

The server provides a comprehensive REST API:

- `GET /api/loans` - Get all loans with filtering and search
- `POST /api/loans` - Create a new loan
- `GET /api/loans/:id` - Get loan details
- `PUT /api/loans/:id` - Update a loan
- `DELETE /api/loans/:id` - Delete a loan
- `POST /api/loans/:id/payments` - Add payment to loan
- `DELETE /api/loans/:loanId/payments/:paymentId` - Delete payment
- `GET /api/analytics` - Get dashboard analytics
- `GET /api/loans/:id/amortization` - Get amortization schedule
- `GET /api/export/*` - Export data (CSV/JSON)
- `GET /api/settings` - Get application settings
- `POST /api/settings` - Update settings
- `GET /health` - Health check endpoint

## Performance Features

- ✅ **Response Compression** - GZIP compression for faster loading
- ✅ **Static File Caching** - 24-hour cache headers for assets
- ✅ **Optimized JSON Parsing** - Efficient data handling
- ✅ **Health Monitoring** - Real-time server status
- ✅ **Error Handling** - Comprehensive error management

#### Using PHP (if installed):
```bash
cd public/
php -S localhost:8000
```
Then open `http://localhost:8000` in your browser.

## Usage

1. **Homepage**: Overview of the loan management system
2. **Apply for Loan**: Add new loan applications
3. **Dashboard**: View analytics, charts, and key metrics
4. **Reports**: Generate detailed financial reports
5. **Loan Details**: View individual loan information and add payments

## Data Storage

- All loan data is stored locally in your browser's localStorage
- Data persists between sessions
- No data is sent to external servers
- You can export/import data if needed

## Browser Compatibility

Works in all modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## No Server Dependencies

This version has been converted to work entirely client-side:
- ❌ Removed: Node.js Express server
- ❌ Removed: API endpoints
- ✅ Added: localStorage for data persistence
- ✅ Added: Client-side calculations
- ✅ Added: Static file navigation

## File Structure

```
public/
├── index.html          # Homepage
├── add.html           # Add loan form
├── dashboard.html     # Analytics dashboard
├── detail.html        # Loan details page
├── reports.html       # Reports and analytics
├── settings.html      # Settings page
├── script.js          # Main JavaScript (static version)
├── dashboard.js       # Dashboard functionality
├── reports.js         # Reports functionality
├── styles.css         # Main styles
└── images.css         # Professional image styles
```

## Development

To modify the website:
1. Edit the HTML files in the `public/` folder
2. Update JavaScript in the respective `.js` files
3. Modify styles in `styles.css` and `images.css`
4. Test by opening `index.html` in your browser

## License

This project is open source and available under the MIT License.

## Technologies Used

- HTML
- CSS
- JavaScript
- Node.js
- Express
