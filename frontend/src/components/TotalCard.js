import React from "react";
import "./TotalCard.css";

const TotalCard = ({ total, count }) => {
  return (
    <div className="total-card">
      <div className="total-content">
        <div className="total-icon">💵</div>
        <div className="total-info">
          <h3 className="total-label">Total Expenses</h3>
          <p className="total-amount">₹{total.toFixed(2)}</p>
          <p className="total-count">
            {count} {count === 1 ? "expense" : "expenses"}
          </p>
        </div>
      </div>
      <div className="total-decoration">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>
    </div>
  );
};

export default TotalCard;
