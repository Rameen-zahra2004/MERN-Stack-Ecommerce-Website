import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ FIXED: attach token to every request
api.interceptors.request.use(
  (config) => {
    // try token from localStorage (adjust key name to match your app)
    const token =
      localStorage.getItem("token") ||
      (() => {
        try {
          const user = JSON.parse(localStorage.getItem("currentUser"));
          return user?.token ?? null;
        } catch {
          return null;
        }
      })();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ FIXED: no redirect on 401 — just reject so components handle it gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // do NOT redirect here — it causes infinite re-render loop
    // each 401 was triggering window.location.href = "/signin"
    // which remounted the component, which re-fetched, which got 401 again
    return Promise.reject(error);
  }
);

export default api;