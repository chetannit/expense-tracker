const fs = require("fs");
const path = require("path");

// File paths
const DATA_DIR = path.join(__dirname, "data");
const EXPENSES_FILE = path.join(DATA_DIR, "expenses.json");
const IDEMPOTENCY_FILE = path.join(DATA_DIR, "idempotency.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

/**
 * Read data from JSON file
 */
const readData = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf8");
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
};

/**
 * Write data to JSON file atomically
 */
const writeData = (filePath, data) => {
  try {
    const tempFile = `${filePath}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), "utf8");
    fs.renameSync(tempFile, filePath);
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    throw error;
  }
};

// Initialize database
console.log("Database initialized successfully");

/**
 * Insert a new expense
 * @param {Object} expense - Expense object
 * @returns {Object} Created expense
 */
const createExpense = (expense) => {
  const expenses = readData(EXPENSES_FILE);
  expenses.push(expense);
  writeData(EXPENSES_FILE, expenses);
  return expense;
};

/**
 * Get all expenses with optional filtering and sorting
 * @param {Object} options - Query options
 * @returns {Array} Array of expenses
 */
const getExpenses = (options = {}) => {
  let expenses = readData(EXPENSES_FILE);

  // Filter by category
  if (options.category) {
    expenses = expenses.filter(
      (expense) => expense.category === options.category,
    );
  }

  // Sort by date
  if (options.sort === "date_desc") {
    expenses.sort((a, b) => {
      const dateCompare = b.date.localeCompare(a.date);
      if (dateCompare !== 0) return dateCompare;
      return b.created_at.localeCompare(a.created_at);
    });
  } else {
    expenses.sort((a, b) => b.created_at.localeCompare(a.created_at));
  }

  // Convert amount from cents to decimal for display
  return expenses.map((expense) => ({
    ...expense,
    amount: expense.amount / 100, // Convert cents to rupees
  }));
};

/**
 * Store idempotency key
 * @param {string} key - Idempotency key
 * @param {string} expenseId - Associated expense ID
 */
const storeIdempotencyKey = (key, expenseId) => {
  const keys = readData(IDEMPOTENCY_FILE);
  keys.push({
    key,
    expense_id: expenseId,
    created_at: new Date().toISOString(),
  });
  writeData(IDEMPOTENCY_FILE, keys);
};

/**
 * Check if idempotency key exists
 * @param {string} key - Idempotency key
 * @returns {string|null} Expense ID if exists
 */
const checkIdempotencyKey = (key) => {
  const keys = readData(IDEMPOTENCY_FILE);
  const result = keys.find((item) => item.key === key);
  return result ? result.expense_id : null;
};

/**
 * Get expense by ID
 * @param {string} id - Expense ID
 * @returns {Object|null} Expense object
 */
const getExpenseById = (id) => {
  const expenses = readData(EXPENSES_FILE);
  const expense = expenses.find((e) => e.id === id);

  if (expense) {
    return {
      ...expense,
      amount: expense.amount / 100, // Convert cents to rupees
    };
  }
  return null;
};

/**
 * Clean up old idempotency keys (older than 24 hours)
 * This should be run periodically
 */
const cleanupIdempotencyKeys = () => {
  const cutoffDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const keys = readData(IDEMPOTENCY_FILE);
  const filteredKeys = keys.filter((item) => item.created_at >= cutoffDate);
  const removed = keys.length - filteredKeys.length;
  if (removed > 0) {
    writeData(IDEMPOTENCY_FILE, filteredKeys);
    console.log(`Cleaned up ${removed} old idempotency keys`);
  }
};

module.exports = {
  createExpense,
  getExpenses,
  storeIdempotencyKey,
  checkIdempotencyKey,
  getExpenseById,
  cleanupIdempotencyKeys,
};
