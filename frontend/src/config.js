const API_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://expense-tracker-eh6v.onrender.com" // Update this after deploying backend
    : "http://localhost:3000");

export default API_URL;
