# Quick Pack Canada Backend

Backend server for handling contact form submissions and orders via email.

## Features

- Contact form email notifications
- Order processing (single and custom orders)
- Email delivery to pprem4324@gmail.com
- RESTful API endpoints
- CORS enabled for frontend communication

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend folder:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
PORT=5000
```

## Gmail App Password Setup

To use Gmail for sending emails:

1. Enable 2-Step Verification on your Google account
2. Go to Google Account settings → Security → 2-Step Verification → App passwords
3. Generate an app password for "Mail"
4. Use this app password as `EMAIL_PASS` in your `.env` file

## Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### POST /api/contact
Send contact form data to email.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "204-555-0123",
  "message": "Hello, I'm interested in your products."
}
```

### POST /api/order
Send order data to email.

**Request Body:**
```json
{
  "orderType": "single",
  "productDetails": {
    "size": "Large",
    "type": "pizza-box",
    "dimensions": "12\" x 12\" x 1.75\"",
    "price": 0.65
  },
  "quantity": "10",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "204-555-0123",
  "address": "123 Main St",
  "city": "Winnipeg",
  "province": "MB",
  "postalCode": "R3B 1A1",
  "additionalNotes": "Please deliver in the morning"
}
```

### GET /api/health
Health check endpoint.

## Frontend Integration

Update your frontend `.env` or configuration to point to:
```
VITE_API_URL=http://localhost:5000
```

## Deployment

For production deployment:
1. Set environment variables on your hosting platform
2. Update `VITE_API_URL` in frontend to point to your backend URL
3. Ensure CORS is configured for your frontend domain

## Technology Stack

- Node.js
- Express.js
- Nodemailer (Email sending)
- CORS (Cross-origin resource sharing)
- dotenv (Environment variables)
