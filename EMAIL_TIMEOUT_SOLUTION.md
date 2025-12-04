# Email Timeout Solution Guide

## Current Issue
Gmail SMTP is timing out when connecting from Render's servers. This is a common issue because:
1. Gmail may block connections from cloud hosting IPs
2. Network restrictions on Render
3. Gmail's security policies

## Solutions Implemented

### 1. Updated Configuration (Already Applied)
- ✅ Switched to port 465 (SSL) instead of 587 (TLS)
- ✅ Extended timeouts to 20 seconds
- ✅ Added retry logic (2 retries)
- ✅ Improved error handling

### 2. Deploy the Updated Code
The code has been updated. After deploying to Render, test again.

## If Timeout Persists - Alternative Solutions

### Option A: Use SendGrid (Recommended - Free Tier Available)

SendGrid works reliably with cloud platforms and offers 100 emails/day free.

**Steps:**
1. Sign up at https://sendgrid.com
2. Create an API key
3. Update `utils/emailUtils.js`:

```javascript
export const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    auth: {
      user: 'apikey',
      pass: process.env.SENDGRID_API_KEY
    }
  });
};
```

4. Set `SENDGRID_API_KEY` in Render environment variables

### Option B: Use Resend (Modern & Developer-Friendly)

**Steps:**
1. Sign up at https://resend.com
2. Get API key
3. Install: `npm install resend`
4. Update email sending logic

### Option C: Use Mailgun (Free Tier: 5,000 emails/month)

**Steps:**
1. Sign up at https://mailgun.com
2. Get SMTP credentials
3. Update transporter configuration

### Option D: Check Gmail Settings

1. **Enable "Less secure app access"** (if using app password)
2. **Check Gmail account security:**
   - Go to Google Account → Security
   - Check for any security alerts
   - Verify app password is correct

3. **Try OAuth2 instead of app password:**
   - More secure
   - Better for cloud deployments
   - Requires Google Cloud Console setup

## Testing After Fix

1. Deploy updated code to Render
2. Test the endpoint:
   ```
   https://quick-pack-canada-backend-1.onrender.com/api/contact?name=Test&email=test@example.com&message=Hello
   ```
3. Check Render logs for connection attempts
4. If still timing out, consider switching to SendGrid or Resend

## Environment Variables Needed

For Gmail (current):
- `EMAIL_USER` - Your Gmail address
- `EMAIL_PASS` - Gmail app password
- `EMAIL_USE_SSL` - Set to `false` to use port 587 (default: true for port 465)

For SendGrid:
- `SENDGRID_API_KEY` - Your SendGrid API key

## Quick Test Command

```bash
curl "https://quick-pack-canada-backend-1.onrender.com/api/contact?name=Test&email=test@example.com&message=Hello"
```

## Next Steps

1. **Deploy the updated code** (with port 465 and retry logic)
2. **Test again** - Port 465 with SSL often works better
3. **If still failing** - Switch to SendGrid or Resend (recommended for production)


