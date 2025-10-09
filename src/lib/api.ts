import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PRODUCTION_API // <- ahora sí existe en el browser
    : "http://localhost:4000";

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // solo si realmente usas cookies; si no, quítalo
});

export default api;
