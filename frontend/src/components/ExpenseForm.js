import React, { useState } from "react";
import "./ExpenseForm.css";

const CATEGORIES = [
  { value: "Food", emoji: "🍔", color: "#FFC107" },
  { value: "Transportation", emoji: "🚗", color: "#2196F3" },
  { value: "Entertainment", emoji: "🎬", color: "#E91E63" },
  { value: "Healthcare", emoji: "🏥", color: "#F44336" },
  { value: "Shopping", emoji: "🛍️", color: "#9C27B0" },
  { value: "Bills", emoji: "📄", color: "#FF9800" },
  { value: "Education", emoji: "📚", color: "#4CAF50" },
  { value: "Other", emoji: "📌", color: "#9E9E9E" },
];

const ExpenseForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const success = await onSubmit({
      ...formData,
      amount: parseFloat(formData.amount),
    });

    if (success) {
      setFormData({
        amount: "",
        category: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
      });
    }

    setLoading(false);
  };

  return (
    <div className="card expense-form-card">
      <h2 className="card-title">
        <span>➕</span> Add New Expense
      </h2>
      <form onSubmit={handleSubmit} className="expense-form">
        <div className="form-group">
          <label htmlFor="amount" className="form-label">
            Amount (₹)
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            step="0.01"
            min="0.01"
            placeholder="100.00"
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category" className="form-label">
            Category
          </label>
          <div className="category-grid">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                className={`category-btn ${formData.category === cat.value ? "active" : ""}`}
                onClick={() =>
                  setFormData({ ...formData, category: cat.value })
                }
                style={{
                  "--category-color": cat.color,
                }}
              >
                <span className="category-emoji">{cat.emoji}</span>
                <span className="category-name">{cat.value}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="e.g., Lunch at restaurant"
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="date" className="form-label">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !formData.category}
          className="submit-btn"
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Adding...
            </>
          ) : (
            <>
              <span>✨</span>
              Add Expense
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;
