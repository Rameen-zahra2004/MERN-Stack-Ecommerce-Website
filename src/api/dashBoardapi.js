import axios from "axios";

// Scoped specifically to /api/dashboard — mirrors adminApi.js's pattern of
// one axios instance per backend resource, rather than reusing adminApi
// (which is baseURL-locked to /api/admins and would 404 dashboard calls).
const dashboardApi = axios.create({
  baseURL: "http://localhost:5000/api/dashboard",
  withCredentials: true,
});

// ─── Request interceptor ──────────────────────────────────
dashboardApi.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

// ─── Response interceptor ─────────────────────────────────
dashboardApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "Something went wrong";
    return Promise.reject({ message, status: error.response?.status });
  },
);

export default dashboardApi;
