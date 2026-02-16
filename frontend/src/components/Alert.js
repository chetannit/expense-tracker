import React, { useEffect } from "react";
import "./Alert.css";

const Alert = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`alert alert-${type} slide-in`}>
      <div className="alert-content">
        <span className="alert-icon">
          {type === "success" && "✅"}
          {type === "error" && "❌"}
          {type === "warning" && "⚠️"}
        </span>
        <span className="alert-message">{message}</span>
      </div>
      <button className="alert-close" onClick={onClose}>
        ✕
      </button>
    </div>
  );
};

export default Alert;
