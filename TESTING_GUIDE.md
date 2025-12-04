# Testing Guide for Render Deployment

## Your Render URL
**Base URL:** `https://quick-pack-canada-backend-1.onrender.com`

## Quick Test Methods

### Method 1: Browser Testing (Easiest)

Simply open these URLs in your browser:

1. **Root Endpoint:**
   ```
   https://quick-pack-canada-backend-1.onrender.com/
   ```

2. **API Info:**
   ```
   https://quick-pack-canada-backend-1.onrender.com/api
   ```

3. **Health Check:**
   ```
   https://quick-pack-canada-backend-1.onrender.com/api/health
   ```

4. **Contact Form (GET):**
   ```
   https://quick-pack-canada-backend-1.onrender.com/api/contact?name=Test%20User&email=test@example.com&message=Hello
   ```

### Method 2: Using Node.js Test Script

Run the test script:
```bash
node test-render-api.js
```

Make sure to update the `BASE_URL` in `test-render-api.js` if your Render URL is different.

### Method 3: Using cURL (Command Line)

**Health Check:**
```bash
curl https://quick-pack-canada-backend-1.onrender.com/api/health
```

**Contact API (GET):**
```bash
curl "https://quick-pack-canada-backend-1.onrender.com/api/contact?name=John%20Doe&email=john@example.com&message=Test%20message"
```

**Contact API (POST):**
```bash
curl -X POST https://quick-pack-canada-backend-1.onrender.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "204-555-0123",
    "message": "Test message from cURL"
  }'
```

**Order API (POST):**
```bash
curl -X POST https://quick-pack-canada-backend-1.onrender.com/api/order \
  -H "Content-Type: application/json" \
  -d '{
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
  }'
```

### Method 4: Using Postman

1. **Create a new request**
2. **Set method** (GET or POST)
3. **Enter URL:** `https://quick-pack-canada-backend-1.onrender.com/api/contact`
4. **For POST requests:**
   - Go to "Body" tab
   - Select "raw" and "JSON"
   - Paste JSON payload:
   ```json
   {
     "name": "John Doe",
     "email": "john@example.com",
     "message": "Test message"
   }
   ```
5. **Click Send**

### Method 5: Using JavaScript Fetch (Browser Console)

Open browser console (F12) and run:

```javascript
// Health Check
fetch('https://quick-pack-canada-backend-1.onrender.com/api/health')
  .then(res => res.json())
  .then(data => console.log(data));

// Contact API (POST)
fetch('https://quick-pack-canada-backend-1.onrender.com/api/contact', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Test message'
  })
})
  .then(res => res.json())
  .then(data => console.log(data));
```

## Expected Responses

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

## Testing Checklist

- [ ] Root endpoint (`/`) returns API info
- [ ] API info endpoint (`/api`) lists available routes
- [ ] Health check (`/api/health`) returns status OK
- [ ] Contact API (GET) works with URL parameters
- [ ] Contact API (POST) works with JSON body
- [ ] Order API (GET) works with URL parameters
- [ ] Order API (POST) works with JSON body
- [ ] Error handling works correctly
- [ ] CORS is enabled (test from browser)

## Common Issues

### Connection Timeout
If you see `ETIMEDOUT` errors, check:
- Gmail app password is correct
- Environment variables are set in Render
- See `RENDER_DEPLOYMENT.md` for solutions

### CORS Errors
- CORS is enabled in the server
- Make sure you're testing from an allowed origin

### 404 Not Found
- Check the URL path is correct
- Verify routes are mounted correctly
- Check Render logs for errors

## Monitoring

Check Render dashboard logs for:
- Server startup messages
- Request logs
- Error messages
- Email connection status

## Frontend Integration

Update your frontend API URL to:
```env
VITE_API_URL=https://quick-pack-canada-backend-1.onrender.com
```

Or in your frontend code:
```javascript
const API_URL = 'https://quick-pack-canada-backend-1.onrender.com/api';
```


