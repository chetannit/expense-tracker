import React from "react";
import "./ExpenseList.css";

const CATEGORY_CONFIG = {
  Food: { emoji: "🍔", color: "#FFC107" },
  Transportation: { emoji: "🚗", color: "#2196F3" },
  Entertainment: { emoji: "🎬", color: "#E91E63" },
  Healthcare: { emoji: "🏥", color: "#F44336" },
  Shopping: { emoji: "🛍️", color: "#9C27B0" },
  Bills: { emoji: "📄", color: "#FF9800" },
  Education: { emoji: "📚", color: "#4CAF50" },
  Other: { emoji: "📌", color: "#9E9E9E" },
};

const ExpenseList = ({ expenses, loading }) => {
  if (loading) {
    return (
      <div className="card expense-list-card">
        <div className="loading-state">
          <div className="loader"></div>
          <p>Loading expenses...</p>
        </div>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="card expense-list-card">
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No expenses yet</h3>
          <p>Start tracking by adding your first expense!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card expense-list-card">
      <h2 className="card-title">
        <span>📋</span> Recent Expenses
      </h2>
      <div className="expense-list">
        {expenses.map((expense, index) => {
          const config =
            CATEGORY_CONFIG[expense.category] || CATEGORY_CONFIG.Other;
          const date = new Date(expense.date);
          const formattedDate = date.toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });

          return (
            <div
              key={expense.id}
              className="expense-item fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div
                className="expense-icon"
                style={{ backgroundColor: config.color }}
              >
                {config.emoji}
              </div>
              <div className="expense-details">
                <h4 className="expense-description">{expense.description}</h4>
                <div className="expense-meta">
                  <span className="expense-category">{expense.category}</span>
                  <span className="expense-date">📅 {formattedDate}</span>
                </div>
              </div>
              <div className="expense-amount">₹{expense.amount.toFixed(2)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExpenseList;
