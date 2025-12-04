# SendGrid Setup Guide

## Why SendGrid?

Gmail is blocking connections from Render's servers. SendGrid is designed for cloud platforms and works reliably.

**Benefits:**
- ✅ Works reliably on cloud platforms (Render, Heroku, AWS, etc.)
- ✅ Free tier: 100 emails/day forever
- ✅ No connection timeout issues
- ✅ Better deliverability
- ✅ Easy setup

## Quick Setup (5 minutes)

### Step 1: Sign Up for SendGrid

1. Go to https://sendgrid.com
2. Click "Start for free"
3. Sign up with your email
4. Verify your email address

### Step 2: Create API Key

1. Once logged in, go to **Settings** → **API Keys**
2. Click **Create API Key**
3. Name it: "Quick Pack Canada Backend"
4. Select **Full Access** (or **Restricted Access** with Mail Send permissions)
5. Click **Create & View**
6. **IMPORTANT:** Copy the API key immediately (you won't see it again!)

### Step 3: Verify Sender Identity (Required)

1. Go to **Settings** → **Sender Authentication**
2. Click **Verify a Single Sender**
3. Fill in the form:
   - **From Email Address:** pprem4324@gmail.com (or your email)
   - **From Name:** Quick Pack Canada
   - **Reply To:** pprem4324@gmail.com
   - **Company Address:** Your business address
   - **Website:** Your website URL
4. Click **Create**
5. Check your email and click the verification link

### Step 4: Add API Key to Render

1. Go to your Render dashboard
2. Select your service
3. Go to **Environment** tab
4. Click **Add Environment Variable**
5. Add:
   - **Key:** `SENDGRID_API_KEY`
   - **Value:** Your SendGrid API key (paste it here)
6. Click **Save Changes**
7. Render will automatically redeploy

### Step 5: Test

After Render redeploys, test the endpoint:
```
https://quick-pack-canada-backend-1.onrender.com/api/contact?name=Test&email=test@example.com&message=Hello
```

You should see success! 🎉

## Environment Variables

**For SendGrid (Recommended):**
```env
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**For Gmail (Fallback - if SendGrid not set):**
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## How It Works

The code automatically:
1. **Checks for SendGrid API key first** (if set, uses SendGrid)
2. **Falls back to Gmail** (if SendGrid not set)
3. **Uses retry logic** for reliability

## Free Tier Limits

- **100 emails/day** (3,000/month)
- Perfect for small to medium businesses
- Upgrade if you need more

## Troubleshooting

### "Sender not verified" error
- Make sure you verified your sender email in SendGrid
- Check the verification email in your inbox

### API key not working
- Verify the API key is correct
- Check it has "Mail Send" permissions
- Make sure it's set in Render environment variables

### Still getting errors
- Check Render logs for detailed error messages
- Verify SendGrid account is active
- Make sure sender is verified

## Cost

- **Free:** 100 emails/day (forever)
- **Essentials:** $19.95/month for 50,000 emails
- **Pro:** $89.95/month for 100,000 emails

For most websites, the free tier is sufficient!

## Support

- SendGrid Docs: https://docs.sendgrid.com
- SendGrid Support: support@sendgrid.com

