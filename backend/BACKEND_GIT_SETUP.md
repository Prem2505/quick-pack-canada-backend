# Backend Repository Setup

Follow these steps to create and upload the backend to GitHub.

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `quick-pack-canada-backend`
3. Description: "Backend API for Quick Pack Canada - Node.js/Express"
4. Choose Public or Private
5. **DO NOT** check "Initialize with README"
6. Click "Create repository"

## Step 2: Initialize Git in Backend Folder

Open PowerShell/Command Prompt in the `backend` folder and run:

```bash
# Navigate to backend folder
cd backend

# Initialize git repository
git init

# Add all backend files
git add .

# Create initial commit
git commit -m "Initial commit: Quick Pack Canada backend"

# Add remote repository (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/quick-pack-canada-backend.git

# Set main branch
git branch -M main

# Push to GitHub
git push -u origin main
```

## Files Included in Backend Repo

- `server.js`
- `controllers/` folder
- `package.json`
- `README.md`
- `.gitignore`
- `SETUP_INSTRUCTIONS.md`
- `.env.example`

## Files Excluded

- `node_modules/`
- `.env` (sensitive data)
- `*.log` files

