# Expense Tracker - Quick Start Guide

## Installation

1. Install backend dependencies:

```bash
cd backend
npm install
```

## Running the Application

### Option 1: Run both servers manually

**Terminal 1 - Backend:**

```bash
cd backend
npm start
```

Server runs at: http://localhost:3000

**Terminal 2 - Frontend:**

```bash
cd frontend
python -m http.server 8080
# OR
npx http-server -p 8080
```

Frontend at: http://localhost:8080

### Option 2: Open frontend directly

After starting the backend, simply open `frontend/index.html` in your browser.

## Testing

1. Backend health check:

```bash
curl http://localhost:3000/health
```

2. Create a test expense:

```bash
curl -X POST http://localhost:3000/expenses \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: test-123" \
  -d "{\"amount\": 100, \"category\": \"Food\", \"description\": \"Test\", \"date\": \"2026-02-16\"}"
```

3. Get all expenses:

```bash
curl http://localhost:3000/expenses
```

## Common Issues

### Port already in use

If port 3000 is busy, change it in `backend/server.js`:

```javascript
const PORT = process.env.PORT || 3001; // Change to any free port
```

Also update `frontend/app.js`:

```javascript
const API_BASE_URL = "http://localhost:3001"; // Match the backend port
```

### CORS errors

Make sure the backend is running before opening the frontend.

### Database errors

Delete the `backend/data/` directory and restart the server to reset the data.

## Acceptance Criteria Checklist

✅ User can create a new expense entry with amount, category, description, and date  
✅ User can view a list of expenses  
✅ User can filter expenses by category  
✅ User can sort expenses by date (newest first)  
✅ User can see a simple total of expenses for the current list  
✅ API handles retries correctly (idempotency)  
✅ Works in real-world conditions (offline detection, network retries)
