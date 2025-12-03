# Render Deployment Guide

## Email Connection Timeout Issues

If you're experiencing connection timeout errors when sending emails from Render, here are solutions:

### Issue: `ETIMEDOUT` or `ECONNREFUSED` errors

Gmail SMTP may block connections from Render's IP addresses or have strict connection requirements.

## Solutions

### Solution 1: Use Gmail OAuth2 (Recommended)

Instead of app passwords, use OAuth2 for more reliable connections:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Gmail API
4. Create OAuth2 credentials
5. Update `utils/emailUtils.js` to use OAuth2

### Solution 2: Use Alternative Email Service

Consider using services that work better with cloud platforms:

- **SendGrid** (Free tier: 100 emails/day)
- **Mailgun** (Free tier: 5,000 emails/month)
- **AWS SES** (Very affordable)
- **Resend** (Modern, developer-friendly)

### Solution 3: Use SMTP Relay Service

Use a dedicated SMTP relay service that's designed for cloud deployments.

### Solution 4: Current Configuration (Improved)

The current setup includes:
- Extended timeout settings (10 seconds)
- Connection pooling
- Better error handling

**If timeouts persist:**
1. Check if Gmail is blocking Render's IP
2. Verify your Gmail account allows "Less secure app access" (if using app password)
3. Consider using a different email service

## Environment Variables on Render

Make sure these are set in Render dashboard:
- `EMAIL_USER` - Your Gmail address
- `EMAIL_PASS` - Gmail app password (16 characters)
- `NODE_ENV` - Set to `production`
- `PORT` - Render sets this automatically

## Testing

After deployment, test the endpoints:
- `GET https://your-app.onrender.com/api/health`
- `POST https://your-app.onrender.com/api/contact`
- `POST https://your-app.onrender.com/api/order`

## Monitoring

Check Render logs for:
- Connection timeout errors
- Authentication errors
- SMTP connection issues

If errors persist, consider switching to a dedicated email service provider.

