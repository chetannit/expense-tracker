# Quick Deployment Commands

## Push to GitHub

```powershell
cd C:\Users\hp\OneDrive\Desktop\Full-Expense
git init
git add .
git commit -m "Initial deployment"
git remote add origin https://github.com/YOUR_USERNAME/expense-tracker.git
git branch -M main
git push -u origin main
```

## Test Backend URL After Deployment

```powershell
# Replace with your actual backend URL
Invoke-RestMethod -Uri https://your-backend-url.onrender.com/health
```

## Update After Changes

```powershell
git add .
git commit -m "Update description"
git push
```

---

## Render Configuration Summary

### Backend Web Service

- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**:
  - `NODE_ENV` = `production`
  - `PORT` = `3000`

### Frontend Static Site

- **Root Directory**: `frontend`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `build`
- **Environment Variables**:
  - `REACT_APP_API_URL` = `https://your-backend-url.onrender.com`

---

## Files to Update After Deployment

### 1. frontend/src/config.js

Replace `your-backend-url.onrender.com` with actual backend URL

### 2. backend/server.js

Replace `your-frontend-url.onrender.com` with actual frontend URL in CORS

---

## Verification Steps

1. ✅ Backend health check responds
2. ✅ Frontend loads without errors
3. ✅ Can create expense
4. ✅ Can view expenses
5. ✅ Can filter and sort
6. ✅ Total calculates correctly
