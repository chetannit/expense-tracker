# Expense Tracker

A full-stack personal finance tool for recording and reviewing personal expenses. Built with production-quality features including idempotency handling, retry logic, and offline support.

## Features

✅ **Create Expenses** - Record expenses with amount, category, description, and date  
✅ **View Expenses** - Display all expenses in an organized list  
✅ **Filter by Category** - Focus on specific expense categories  
✅ **Sort by Date** - View expenses from newest to oldest  
✅ **Calculate Totals** - Real-time total of displayed expenses  
✅ **Idempotent Requests** - Safe handling of duplicate requests due to network issues  
✅ **Retry Logic** - Automatic retry on network failures  
✅ **Offline Detection** - User feedback for connectivity issues

## Tech Stack

### Backend

- **Node.js** with **Express.js** - RESTful API server
- **JSON File Storage** - Simple, reliable file-based persistence
- **UUID** - Unique identifier generation

### Frontend

- **Vanilla JavaScript** - No framework dependencies
- **Modern CSS** - Responsive design with CSS Grid and Flexbox
- **Fetch API** - HTTP requests with retry logic

## Why JSON File Storage?

JSON file storage was chosen for data persistence because:

1. **Zero Dependencies** - No native compilation or build tools required
2. **Cross-Platform** - Works on Windows, macOS, and Linux without issues
3. **Simple Setup** - No database installation or configuration needed
4. **Human-Readable** - Easy to inspect and debug data
5. **ACID Operations** - Atomic writes using temporary files ensure data integrity
6. **Lightweight** - Perfect for personal use with minimal overhead
7. **Easy Backup** - Simple file copy for backups
8. **No Build Issues** - No C++ compiler or Visual Studio requirements

For a personal expense tracker with a single user, JSON file storage provides excellent reliability and simplicity without the complexity of database setup or native module compilation.

## Project Structure

```
Full-Expense/
├── backend/
│   ├── server.js              # Express server setup
│   ├── db.js                  # Database layer and queries
│   ├── routes/
│   │   └── expenses.js        # Expense routes (POST, GET)
│   ├── middleware/
│   │   └── idempotency.js     # Idempotency key middleware
│   ├── data/                  # JSON data files (created on first run)
│       ├── expenses.json      # Expenses data
│       └── idempotency.json   # Idempotency keys
│   └── expenses.db            # SQLite database (created on first run)
├── frontend/
│   ├── index.html             # Main HTML structure
│   ├── styles.css             # Styling and responsive design
│   └── app.js                 # Frontend logic and API calls
└── README.md                  # This file
```

## Installation

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)

### Steps

1. **Clone or navigate to the project directory**

   ```bash
   cd Full-Expense
   ```

2. **Install backend dependencies**

   ```bash
   cd backend
   npm install
   ```

3. **Start the backend server**

   ```bash
   npm start
   ```

   The server will start on `http://localhost:3000`

4. **Open the frontend** (in a new terminal or window)

   ```bash
   cd ../frontend
   ```

   Open `index.html` in your web browser, or serve it with a simple HTTP server:

   ```bash
   # Python 3
   python -m http.server 8080

   # Node.js (if you have http-server installed)
   npx http-server -p 8080
   ```

   Then visit `http://localhost:8080`

## API Documentation

### Base URL

```
http://localhost:3000
```

### Endpoints

#### 1. Create Expense

**POST** `/expenses`

Create a new expense entry. Supports idempotency via `Idempotency-Key` header.

**Headers:**

```
Content-Type: application/json
Idempotency-Key: <unique-key> (optional but recommended)
```

**Request Body:**

```json
{
  "amount": 150.5,
  "category": "Food",
  "description": "Lunch at restaurant",
  "date": "2026-02-16"
}
```

**Response (201 Created):**

```json
{
  "message": "Expense created successfully",
  "expense": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "amount": 150.5,
    "category": "Food",
    "description": "Lunch at restaurant",
    "date": "2026-02-16",
    "created_at": "2026-02-16T10:30:00.000Z"
  }
}
```

**Error Response (400 Bad Request):**

```json
{
  "error": "Missing required fields",
  "required": ["amount", "category", "description", "date"]
}
```

#### 2. Get Expenses

**GET** `/expenses`

Retrieve all expenses with optional filtering and sorting.

**Query Parameters:**

- `category` (optional) - Filter by category (e.g., "Food", "Transportation")
- `sort` (optional) - Sort order: `date_desc` for newest first

**Examples:**

```
GET /expenses
GET /expenses?category=Food
GET /expenses?sort=date_desc
GET /expenses?category=Food&sort=date_desc
```

**Response (200 OK):**

```json
{
  "expenses": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "amount": 150.5,
      "category": "Food",
      "description": "Lunch at restaurant",
      "date": "2026-02-16",
      "created_at": "2026-02-16T10:30:00.000Z"
    }
  ],
  "total": 150.5,
  "count": 1
}
```

#### 3. Health Check

**GET** `/health`

Check if the server is running.

**Response (200 OK):**

```json
{
  "status": "ok",
  "timestamp": "2026-02-16T10:30:00.000Z"
}
```

## Idempotency Implementation

The API implements idempotency to handle duplicate requests safely. This is crucial for real-world scenarios where:

- Network requests fail and are retried
- Users refresh the page after submitting
- Mobile apps retry on network issues

**How it works:**

1. Client generates a unique `Idempotency-Key` (UUID or timestamp-based)
2. Client sends the key in request header
3. Server checks if this key was already processed
4. If yes, returns the existing expense (no duplicate created)
5. If no, creates new expense and stores the key
6. Keys are automatically cleaned up after 24 hours

**Example:**

```javascript
// First request with key "abc-123"
POST /expenses
Idempotency-Key: abc-123
{ "amount": 100, ... }
→ Creates expense with ID "xyz-789"

// Retry with same key (due to network timeout)
POST /expenses
Idempotency-Key: abc-123
{ "amount": 100, ... }
→ Returns existing expense "xyz-789" (no duplicate)
```

## Features in Detail

### 1. Data Model

Each expense has:

- **id**: UUID (unique identifier)
- **amount**: Stored as cents (integer) to avoid floating-point errors
- **category**: String (Food, Transportation, etc.)
- **description**: User-provided text
- **date**: ISO date string (YYYY-MM-DD)
- **created_at**: ISO timestamp

### 2. Money Handling

Amounts are stored as **integers in cents** (e.g., ₹150.50 → 15050 cents) to avoid floating-point arithmetic errors. They're converted back to decimal for display.

### 3. Retry Logic

The frontend automatically retries failed requests up to 3 times with exponential backoff:

- Attempt 1: Immediate
- Attempt 2: After 1 second
- Attempt 3: After 2 seconds

### 4. Offline Support

The app detects when the user goes offline and shows appropriate messages. When back online, it automatically refreshes the expense list.

### 5. Input Validation

Both frontend and backend validate:

- Amount is a positive number
- All required fields are present
- Date is in valid format
- Category is from allowed list

## Development

### Running in Development Mode

```bash
cd backend
npm run dev
```

This uses `nodemon` to automatically restart the server on file changes.

### Testing the API

You can test the API using curl or any HTTP client:

```bash
# Create an expense
curl -X POST http://localhost:3000/expenses \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: test-key-123" \
  -d '{
    "amount": 250,
    "category": "Food",
    "description": "Dinner",
    "date": "2026-02-16"
  }'

# Get all expenses
curl http://localhost:3000/expenses

# Get expenses filtered by category
curl http://localhost:3000/expenses?category=Food

# Get expenses sorted by date (newest first)
curl http://localhost:3000/expenses?sort=date_desc
```

## Production Considerations

This implementation includes production-ready features:

1. **Error Handling** - Comprehensive error messages and HTTP status codes
2. **Input Validation** - Server-side validation of all inputs
3. **Security** - XSS prevention through HTML escaping
4. **CORS** - Enabled for cross-origin requests
5. **Indexes** - Database indexes on category and date for fast queries
6. **Resource Cleanup** - Automatic cleanup of old idempotency keys
7. **Logging** - Console logging for debugging and monitoring
8. **Graceful Degradation** - Works offline with appropriate user feedback

### Future Enhancements

For scaling beyond personal use:

- Add user authentication and multi-user support
- Implement expense editing and deletion
- Add data export (CSV, PDF)
- Create budget tracking and alerts
- Add charts and visualizations
- Implement pagination for large datasets
- Add search functionality
- Create expense categories customization
- Add recurring expense support
- Implement backup and restore

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome)

## License

MIT

## Author

Built as a demonstration of production-quality full-stack development practices.

---

**Questions or Issues?** Feel free to reach out or open an issue in the repository.
