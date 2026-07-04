import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // httpOnly cookies are sent automatically — no manual token handling needed
  headers: {
    "Content-Type": "application/json",
  },
});

// FIX (C9): removed the request interceptor entirely.
// Tokens live in httpOnly cookies set by the backend — JS should never
// read or attach them manually. `withCredentials: true` above is sufficient.

// FIX (M4): on 401, attempt a silent refresh and retry once before giving up.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await api.post("/auth/refresh");
        return api(originalRequest);
      } catch {
        // refresh itself failed — session is truly over
        window.location.href = "/signin";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
