# Backend Setup Instructions

## Step 1: Install Dependencies

Navigate to the backend folder and install dependencies:

```bash
cd backend
npm install
```

## Step 2: Configure Gmail App Password

1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security** → **2-Step Verification** (enable it if not already enabled)
3. Go to **App passwords**: https://myaccount.google.com/apppasswords
4. Select **Mail** and **Other (Custom name)**
5. Enter "Quick Pack Canada Backend" as the name
6. Click **Generate**
7. Copy the 16-character app password (you'll need this for the .env file)

## Step 3: Create .env File

Create a `.env` file in the `backend` folder:

```env
EMAIL_USER=your-gmail-address@gmail.com
EMAIL_PASS=your-16-character-app-password
PORT=5000
```

**Important:** 
- Use the Gmail address that will send the emails
- Use the app password (not your regular Gmail password)
- The emails will be sent TO: pprem4324@gmail.com

## Step 4: Start the Backend Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on `http://localhost:5000`

## Step 5: Configure Frontend

Create a `.env` file in the root directory (same level as package.json):

```env
VITE_API_URL=http://localhost:5000
```

Then restart your frontend development server.

## Testing

1. Start the backend server
2. Start the frontend server
3. Fill out the contact form on the website
4. Check pprem4324@gmail.com for the email

## Troubleshooting

### Email not sending?
- Verify your app password is correct
- Make sure 2-Step Verification is enabled
- Check that EMAIL_USER matches the Gmail account
- Check server console for error messages

### CORS errors?
- Make sure the backend server is running
- Verify VITE_API_URL in frontend .env matches backend URL

### Connection refused?
- Ensure backend server is running on port 5000
- Check firewall settings
- Verify the port is not already in use

