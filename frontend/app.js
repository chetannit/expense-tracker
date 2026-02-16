// Configuration
const API_BASE_URL = "http://localhost:3000";
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000; // milliseconds

// Category emoji mapping
const categoryEmojis = {
  Food: "🍔",
  Transportation: "🚗",
  Entertainment: "🎬",
  Healthcare: "🏥",
  Shopping: "🛍️",
  Bills: "📄",
  Education: "📚",
  Other: "📌",
};

// DOM Elements
const expenseForm = document.getElementById("expense-form");
const expensesList = document.getElementById("expenses-list");
const filterCategory = document.getElementById("filter-category");
const sortOrder = document.getElementById("sort-order");
const totalAmount = document.getElementById("total-amount");
const expenseCount = document.getElementById("expense-count");
const formMessage = document.getElementById("form-message");
const submitBtn = document.getElementById("submit-btn");
const loadingExpenses = document.getElementById("loading-expenses");
const noExpenses = document.getElementById("no-expenses");

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  // Set today's date as default
  document.getElementById("date").valueAsDate = new Date();

  // Load expenses on page load
  loadExpenses();

  // Event listeners
  expenseForm.addEventListener("submit", handleSubmitExpense);
  filterCategory.addEventListener("change", loadExpenses);
  sortOrder.addEventListener("change", loadExpenses);
});

/**
 * Generate a unique idempotency key
 */
function generateIdempotencyKey() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Show message to user
 */
function showMessage(message, type = "success") {
  formMessage.textContent = message;
  formMessage.className = `message ${type}`;
  formMessage.style.display = "block";

  setTimeout(() => {
    formMessage.style.display = "none";
  }, 5000);
}

/**
 * Make API request with retry logic
 */
async function fetchWithRetry(url, options = {}, attempt = 1) {
  try {
    const response = await fetch(url, options);

    // If response is ok, return it
    if (response.ok) {
      return response;
    }

    // If client error (4xx), don't retry
    if (response.status >= 400 && response.status < 500) {
      return response;
    }

    // Server error (5xx), retry if attempts remain
    if (attempt < RETRY_ATTEMPTS) {
      console.log(`Attempt ${attempt} failed, retrying...`);
      await new Promise((resolve) =>
        setTimeout(resolve, RETRY_DELAY * attempt),
      );
      return fetchWithRetry(url, options, attempt + 1);
    }

    return response;
  } catch (error) {
    // Network error, retry if attempts remain
    if (attempt < RETRY_ATTEMPTS) {
      console.log(`Network error on attempt ${attempt}, retrying...`);
      await new Promise((resolve) =>
        setTimeout(resolve, RETRY_DELAY * attempt),
      );
      return fetchWithRetry(url, options, attempt + 1);
    }
    throw error;
  }
}

/**
 * Handle form submission
 */
async function handleSubmitExpense(e) {
  e.preventDefault();

  const formData = new FormData(expenseForm);
  const expense = {
    amount: parseFloat(formData.get("amount")),
    category: formData.get("category"),
    description: formData.get("description"),
    date: formData.get("date"),
  };

  // Disable submit button and show spinner
  submitBtn.disabled = true;
  submitBtn.querySelector(".btn-text").textContent = "Adding...";
  submitBtn.querySelector(".spinner").style.display = "inline-block";

  // Generate idempotency key
  const idempotencyKey = generateIdempotencyKey();

  try {
    const response = await fetchWithRetry(`${API_BASE_URL}/expenses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify(expense),
    });

    const data = await response.json();

    if (response.ok) {
      showMessage("Expense added successfully!", "success");
      expenseForm.reset();
      document.getElementById("date").valueAsDate = new Date();
      loadExpenses();
    } else {
      showMessage(data.error || "Failed to add expense", "error");
    }
  } catch (error) {
    console.error("Error adding expense:", error);
    showMessage(
      "Network error. Please check your connection and try again.",
      "error",
    );
  } finally {
    // Re-enable submit button
    submitBtn.disabled = false;
    submitBtn.querySelector(".btn-text").textContent = "Add Expense";
    submitBtn.querySelector(".spinner").style.display = "none";
  }
}

/**
 * Load and display expenses
 */
async function loadExpenses() {
  // Show loading state
  loadingExpenses.style.display = "block";
  expensesList.innerHTML = "";
  noExpenses.style.display = "none";

  // Build query parameters
  const params = new URLSearchParams();
  const category = filterCategory.value;
  const sort = sortOrder.value;

  if (category) {
    params.append("category", category);
  }
  if (sort) {
    params.append("sort", sort);
  }

  try {
    const response = await fetchWithRetry(
      `${API_BASE_URL}/expenses?${params.toString()}`,
    );

    const data = await response.json();

    if (response.ok) {
      displayExpenses(data.expenses, data.total, data.count);
    } else {
      throw new Error(data.error || "Failed to load expenses");
    }
  } catch (error) {
    console.error("Error loading expenses:", error);
    expensesList.innerHTML =
      '<div class="error">Failed to load expenses. Please refresh the page.</div>';
  } finally {
    loadingExpenses.style.display = "none";
  }
}

/**
 * Display expenses in the UI
 */
function displayExpenses(expenses, total, count) {
  // Update total and count
  totalAmount.textContent = `₹${total.toFixed(2)}`;
  expenseCount.textContent = count;

  // Clear existing expenses
  expensesList.innerHTML = "";

  // Check if there are no expenses
  if (expenses.length === 0) {
    noExpenses.style.display = "block";
    return;
  }

  // Display each expense
  expenses.forEach((expense) => {
    const expenseItem = createExpenseElement(expense);
    expensesList.appendChild(expenseItem);
  });
}

/**
 * Create an expense element
 */
function createExpenseElement(expense) {
  const div = document.createElement("div");
  div.className = "expense-item";

  const categoryEmoji = categoryEmojis[expense.category] || "📌";
  const categoryClass = `category-${expense.category.toLowerCase()}`;

  // Format date
  const date = new Date(expense.date);
  const formattedDate = date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  div.innerHTML = `
        <div class="expense-category ${categoryClass}">
            ${categoryEmoji}
        </div>
        <div class="expense-details">
            <div class="expense-description">${escapeHtml(expense.description)}</div>
            <div class="expense-meta">
                <span class="expense-category-text">
                    ${expense.category}
                </span>
                <span class="expense-date">📅 ${formattedDate}</span>
            </div>
        </div>
        <div class="expense-amount">
            ₹${expense.amount.toFixed(2)}
        </div>
    `;

  return div;
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Handle offline status
 */
window.addEventListener("online", () => {
  showMessage("Back online! Refreshing expenses...", "success");
  loadExpenses();
});

window.addEventListener("offline", () => {
  showMessage(
    "You are offline. Changes will be attempted when connection is restored.",
    "error",
  );
});
