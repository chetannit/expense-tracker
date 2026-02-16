import React from "react";
import "./Header.css";

const Header = ({ isOnline }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="header-title">
            <span className="icon">💰</span>
            Expense Tracker
          </h1>
          <p className="header-subtitle">Manage your finances with ease</p>
        </div>
        <div className="header-right">
          <div
            className={`status-indicator ${isOnline ? "online" : "offline"}`}
          >
            <span className="status-dot"></span>
            <span className="status-text">
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
