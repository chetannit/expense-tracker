# Render Deployment Guide

## 🚀 Complete Deployment Steps

### Prerequisites

- GitHub account
- Render account (free at https://render.com)
- Git installed on your computer

---

## Step 1: Push Your Code to GitHub

### 1.1 Initialize Git Repository

```powershell
# In your project root directory
cd C:\Users\hp\OneDrive\Desktop\Full-Expense

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Prepare for Render deployment"
```

### 1.2 Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `expense-tracker` (or your preferred name)
3. Keep it Public or Private (both work with Render)
4. Don't initialize with README (you already have files)
5. Click "Create repository"

### 1.3 Push to GitHub

```powershell
# Replace YOUR_USERNAME with your actual GitHub username
git remote add origin https://github.com/YOUR_USERNAME/expense-tracker.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy Backend to Render

### 2.1 Create Web Service

1. Go to https://render.com
2. Sign up or log in
3. Click **"New +"** button → Select **"Web Service"**
4. Click **"Connect GitHub"** and authorize Render
5. Select your `expense-tracker` repository

### 2.2 Configure Backend Service

Fill in these settings:

| Field              | Value                               |
| ------------------ | ----------------------------------- |
| **Name**           | `expense-tracker-api` (or any name) |
| **Region**         | Choose closest to you               |
| **Branch**         | `main`                              |
| **Root Directory** | `backend`                           |
| **Runtime**        | `Node`                              |
| **Build Command**  | `npm install`                       |
| **Start Command**  | `npm start`                         |
| **Instance Type**  | `Free`                              |

### 2.3 Add Environment Variables

Click **"Advanced"** button, then add:

| Key        | Value        |
| ---------- | ------------ |
| `NODE_ENV` | `production` |
| `PORT`     | `3000`       |

### 2.4 Deploy Backend

1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. Once deployed, you'll see: ✅ **Live**
4. **IMPORTANT**: Copy your backend URL (e.g., `https://expense-tracker-api.onrender.com`)

### 2.5 Test Backend

```powershell
# Test the health endpoint (replace with your actual URL)
Invoke-RestMethod -Uri https://expense-tracker-api-xxxx.onrender.com/health
```

You should see: `{ "status": "ok", "timestamp": "..." }`

---

## Step 3: Update Frontend Configuration

### 3.1 Update API URL

Open `frontend/src/config.js` and replace the production URL:

```javascript
const API_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://expense-tracker-api-xxxx.onrender.com" // YOUR ACTUAL BACKEND URL
    : "http://localhost:3000");

export default API_URL;
```

### 3.2 Commit and Push

```powershell
git add frontend/src/config.js
git commit -m "Update production API URL"
git push
```

---

## Step 4: Deploy Frontend to Render

### 4.1 Create Static Site

1. In Render dashboard, click **"New +"** → **"Static Site"**
2. Select your `expense-tracker` repository again

### 4.2 Configure Frontend Service

Fill in these settings:

| Field                 | Value                          |
| --------------------- | ------------------------------ |
| **Name**              | `expense-tracker-frontend`     |
| **Branch**            | `main`                         |
| **Root Directory**    | `frontend`                     |
| **Build Command**     | `npm install && npm run build` |
| **Publish Directory** | `build`                        |

### 4.3 Add Environment Variables

Click **"Advanced"**, then add:

| Key                 | Value                                                              |
| ------------------- | ------------------------------------------------------------------ |
| `REACT_APP_API_URL` | `https://expense-tracker-api-xxxx.onrender.com` (your backend URL) |

### 4.4 Deploy Frontend

1. Click **"Create Static Site"**
2. Wait 5-10 minutes for deployment
3. Once deployed, you'll see: ✅ **Live**
4. **Copy your frontend URL** (e.g., `https://expense-tracker-frontend.onrender.com`)

---

## Step 5: Update Backend CORS

### 5.1 Update CORS Configuration

Open `backend/server.js` and update the CORS origin array:

```javascript
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://expense-tracker-frontend-xxxx.onrender.com", // YOUR ACTUAL FRONTEND URL
    /\.onrender\.com$/,
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Idempotency-Key"],
};
```

### 5.2 Commit and Push

```powershell
git add backend/server.js
git commit -m "Update CORS for production frontend"
git push
```

Render will automatically redeploy your backend!

---

## Step 6: Test Your Live Application

### 6.1 Open Your App

Visit your frontend URL: `https://expense-tracker-frontend-xxxx.onrender.com`

### 6.2 Test All Features

- ✅ Add a new expense
- ✅ View expenses list
- ✅ Filter by category
- ✅ Sort by date
- ✅ Check total calculation

---

## 🎉 You're Live!

Your app is now deployed at:

- **Frontend**: https://expense-tracker-frontend-xxxx.onrender.com
- **Backend API**: https://expense-tracker-api-xxxx.onrender.com

---

## ⚠️ Important Notes

### Free Tier Limitations

- Services **spin down after 15 minutes** of inactivity
- First request after spin-down takes **~30-60 seconds** (cold start)
- 750 hours/month of free usage
- Data persists in JSON files

### Handling Cold Starts

Your users might notice a delay on first load. This is normal for free tier.

### Upgrade to Paid Plan ($7/month per service)

Benefits:

- ✅ No spin-down (always active)
- ✅ Faster response times
- ✅ Custom domains
- ✅ Better support

---

## 🔍 Troubleshooting

### Problem: CORS Errors

**Solution**: Check that backend CORS includes your frontend URL

### Problem: Build Failed

**Solution**:

```powershell
# Test build locally first
cd frontend
npm run build

cd ../backend
npm install
```

### Problem: API Not Responding

**Solution**: Check Render logs:

1. Go to your service in Render dashboard
2. Click "Logs" tab
3. Look for errors

### Problem: Environment Variables Not Working

**Solution**:

- Redeploy service after adding env vars
- Check spelling of variable names

---

## 📊 Monitor Your Services

### View Logs

Render Dashboard → Your Service → **Logs** tab

### View Metrics

Render Dashboard → Your Service → **Metrics** tab

### Manual Deploy

Render Dashboard → Your Service → **Manual Deploy** button

---

## 🔄 Making Updates

After making code changes:

```powershell
git add .
git commit -m "Your update message"
git push
```

Render automatically redeploys! ⚡

---

## 🌐 Custom Domain (Optional)

### Backend

1. Go to backend service → Settings → Custom Domain
2. Add your domain (e.g., `api.yourapp.com`)
3. Update DNS with CNAME record

### Frontend

1. Go to frontend static site → Settings → Custom Domain
2. Add your domain (e.g., `yourapp.com`)
3. Update DNS with CNAME record

---

## 💰 Cost Breakdown

| Service              | Free Tier             | Paid Tier    |
| -------------------- | --------------------- | ------------ |
| Backend Web Service  | Free (with spin-down) | $7/month     |
| Frontend Static Site | Free (always on)      | $0           |
| **Total**            | **$0/month**          | **$7/month** |

---

## ✅ Deployment Checklist

Before going live, verify:

- [ ] Code pushed to GitHub
- [ ] Backend deployed and showing "Live"
- [ ] Backend health endpoint responds
- [ ] Frontend config.js has correct backend URL
- [ ] Frontend deployed and showing "Live"
- [ ] Backend CORS includes frontend URL
- [ ] Can create an expense
- [ ] Can view expenses
- [ ] Can filter by category
- [ ] Can sort by date
- [ ] Total calculates correctly
- [ ] Works on mobile devices

---

## 🎯 Next Steps

1. Share your live app URL with friends!
2. Consider adding more features
3. Upgrade to paid plan for better performance
4. Add custom domain for professional look
5. Set up monitoring and analytics

---

## 📞 Need Help?

- **Render Docs**: https://render.com/docs
- **Render Support**: support@render.com
- **Community**: Render Community Forum

---

Good luck with your deployment! 🚀
