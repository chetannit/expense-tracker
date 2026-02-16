const API_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://your-backend-url.onrender.com" // Update this after deploying backend
    : "http://localhost:3000");

export default API_URL;
