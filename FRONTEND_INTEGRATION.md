# Frontend Integration Guide

## Backend API URL (Render)

**Base API URL:**
```
https://quick-pack-canada-backend-1.onrender.com
```

**API Endpoints Base:**
```
https://quick-pack-canada-backend-1.onrender.com/api
```

## Frontend Configuration

### Option 1: Environment Variable (Recommended)

Create a `.env` file in your frontend project:

```env
VITE_API_URL=https://quick-pack-canada-backend-1.onrender.com
```

Or for Create React App:
```env
REACT_APP_API_URL=https://quick-pack-canada-backend-1.onrender.com
```

Or for Next.js:
```env
NEXT_PUBLIC_API_URL=https://quick-pack-canada-backend-1.onrender.com
```

### Option 2: Direct Configuration

In your frontend code, create an API configuration file:

**JavaScript/TypeScript:**
```javascript
// config/api.js or config/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://quick-pack-canada-backend-1.onrender.com';

export const API_ENDPOINTS = {
  BASE: API_BASE_URL,
  CONTACT: `${API_BASE_URL}/api/contact`,
  ORDER: `${API_BASE_URL}/api/order`,
  HEALTH: `${API_BASE_URL}/api/health`
};

export default API_BASE_URL;
```

## Available API Endpoints

### Health Check
```
GET https://quick-pack-canada-backend-1.onrender.com/api/health
```

### Contact Form
```
GET https://quick-pack-canada-backend-1.onrender.com/api/contact?name=John&email=john@example.com&message=Hello

POST https://quick-pack-canada-backend-1.onrender.com/api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "204-555-0123",
  "message": "Hello, I'm interested in your products."
}
```

### Order Form
```
GET https://quick-pack-canada-backend-1.onrender.com/api/order?name=Jane&email=jane@example.com&...

POST https://quick-pack-canada-backend-1.onrender.com/api/order
Content-Type: application/json

{
  "orderType": "single",
  "productDetails": {
    "size": "Large",
    "type": "pizza-box",
    "dimensions": "12x12x1.75"
  },
  "quantity": "10",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "204-555-0456",
  "address": "123 Main St",
  "city": "Winnipeg",
  "province": "MB",
  "postalCode": "R3B 1A1"
}
```

## Frontend Code Examples

### React/Vue Example (Contact Form)

```javascript
// Using fetch
const submitContactForm = async (formData) => {
  try {
    const response = await fetch('https://quick-pack-canada-backend-1.onrender.com/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('Email sent successfully!');
      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
```

### Using Axios

```javascript
import axios from 'axios';

const API_BASE_URL = 'https://quick-pack-canada-backend-1.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Contact form
export const submitContact = async (data) => {
  const response = await api.post('/contact', data);
  return response.data;
};

// Order form
export const submitOrder = async (data) => {
  const response = await api.post('/order', data);
  return response.data;
};

// Health check
export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};
```

### Using Environment Variable

```javascript
// config.js
const API_URL = import.meta.env.VITE_API_URL || 'https://quick-pack-canada-backend-1.onrender.com';

// In your component
const response = await fetch(`${API_URL}/api/contact`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
});
```

## CORS Configuration

The backend has CORS enabled, so your frontend can make requests from any domain. No additional CORS configuration needed.

## Error Handling

```javascript
try {
  const response = await fetch('https://quick-pack-canada-backend-1.onrender.com/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }
  
  return data;
} catch (error) {
  console.error('API Error:', error);
  // Handle error (show user message, etc.)
  throw error;
}
```

## Response Format

### Success Response (200)
```json
{
  "success": true,
  "message": "Email sent successfully!"
}
```

### Error Response (400/500)
```json
{
  "success": false,
  "message": "Error message here"
}
```

## Testing

Test the connection from your frontend:

```javascript
// Test health check
fetch('https://quick-pack-canada-backend-1.onrender.com/api/health')
  .then(res => res.json())
  .then(data => console.log('Backend is running:', data));
```

## Important Notes

1. **HTTPS Required**: Always use `https://` (not `http://`)
2. **CORS Enabled**: Backend allows requests from any origin
3. **Environment Variables**: Use environment variables for different environments (dev/prod)
4. **Error Handling**: Always handle errors gracefully
5. **Loading States**: Show loading indicators while requests are in progress

## Local Development

For local development, you can use:
```env
VITE_API_URL=http://localhost:5000
```

This way, you can switch between local and production easily.

