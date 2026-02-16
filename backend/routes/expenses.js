const express = require("express");
const { v4: uuidv4 } = require("uuid");
const {
  createExpense,
  getExpenses,
  storeIdempotencyKey,
  checkIdempotencyKey,
  getExpenseById,
} = require("../db");

const router = express.Router();

/**
 * POST /expenses
 * Create a new expense
 * Supports idempotency via Idempotency-Key header
 */
router.post("/", async (req, res) => {
  try {
    const { amount, category, description, date } = req.body;

    // Validate required fields
    if (!amount || !category || !description || !date) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["amount", "category", "description", "date"],
      });
    }

    // Validate amount is a positive number
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return res.status(400).json({
        error: "Amount must be a positive number",
      });
    }

    // Validate date format
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return res.status(400).json({
        error: "Invalid date format. Use ISO 8601 format (YYYY-MM-DD)",
      });
    }

    // Check for idempotency key
    const idempotencyKey = req.idempotencyKey;

    if (idempotencyKey) {
      // Check if this request was already processed
      const existingExpenseId = checkIdempotencyKey(idempotencyKey);

      if (existingExpenseId) {
        // Return the existing expense
        const existingExpense = getExpenseById(existingExpenseId);
        return res.status(200).json({
          message: "Expense already created (idempotent)",
          expense: existingExpense,
        });
      }
    }

    // Create new expense
    const expenseId = uuidv4();
    const expense = {
      id: expenseId,
      amount: Math.round(amountNum * 100), // Store as cents to avoid floating-point issues
      category: category.trim(),
      description: description.trim(),
      date: dateObj.toISOString().split("T")[0], // Store as YYYY-MM-DD
      created_at: new Date().toISOString(),
    };

    // Save to database
    createExpense(expense);

    // Store idempotency key if provided
    if (idempotencyKey) {
      storeIdempotencyKey(idempotencyKey, expenseId);
    }

    // Return created expense (with amount in rupees)
    res.status(201).json({
      message: "Expense created successfully",
      expense: {
        ...expense,
        amount: expense.amount / 100,
      },
    });
  } catch (error) {
    console.error("Error creating expense:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

/**
 * GET /expenses
 * Get all expenses with optional filtering and sorting
 * Query parameters:
 * - category: Filter by category
 * - sort: Sort order (date_desc for newest first)
 */
router.get("/", async (req, res) => {
  try {
    const { category, sort } = req.query;

    const options = {};

    if (category) {
      options.category = category;
    }

    if (sort) {
      options.sort = sort;
    }

    const expenses = getExpenses(options);

    // Calculate total
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    res.status(200).json({
      expenses,
      total: parseFloat(total.toFixed(2)),
      count: expenses.length,
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

module.exports = router;
