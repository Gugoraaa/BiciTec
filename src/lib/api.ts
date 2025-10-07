import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "production"
    ? process.env.PRODUCTION_API
    : "http://localhost:4000";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default api;
