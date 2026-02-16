import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import FilterControls from "./components/FilterControls";
import TotalCard from "./components/TotalCard";
import Header from "./components/Header";
import Alert from "./components/Alert";
import API_BASE_URL from "./config";

console.log("API URL:", API_BASE_URL);

function App() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("date_desc");
  const [alert, setAlert] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Fetch expenses
  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.append("category", category);
      if (sortOrder) params.append("sort", sortOrder);

      const response = await axios.get(
        `${API_BASE_URL}/expenses?${params.toString()}`,
      );
      setExpenses(response.data.expenses);
      setFilteredExpenses(response.data.expenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      showAlert("Failed to load expenses", "error");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchExpenses();
  }, [category, sortOrder]);

  // Online/Offline detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showAlert("Back online! Refreshing expenses...", "success");
      fetchExpenses();
    };

    const handleOffline = () => {
      setIsOnline(false);
      showAlert(
        "You are offline. Changes will be attempted when connection is restored.",
        "warning",
      );
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Show alert
  const showAlert = (message, type = "success") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000);
  };

  // Add expense
  const handleAddExpense = async (expenseData) => {
    try {
      const idempotencyKey = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const response = await axios.post(
        `${API_BASE_URL}/expenses`,
        expenseData,
        {
          headers: {
            "Idempotency-Key": idempotencyKey,
          },
        },
      );

      showAlert("Expense added successfully!", "success");
      fetchExpenses();
      return true;
    } catch (error) {
      console.error("Error adding expense:", error);
      showAlert(
        error.response?.data?.error || "Failed to add expense",
        "error",
      );
      return false;
    }
  };

  // Calculate total
  const total = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );

  return (
    <div className="App">
      <div className="container">
        <Header isOnline={isOnline} />

        {alert && (
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
          />
        )}

        <div className="main-content">
          <div className="left-panel">
            <ExpenseForm onSubmit={handleAddExpense} />
          </div>

          <div className="right-panel">
            <TotalCard total={total} count={filteredExpenses.length} />

            <FilterControls
              category={category}
              sortOrder={sortOrder}
              onCategoryChange={setCategory}
              onSortChange={setSortOrder}
            />

            <ExpenseList expenses={filteredExpenses} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
