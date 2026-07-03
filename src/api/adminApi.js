// import axios from "axios";

// const adminApi = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/admins",
//   withCredentials: true,
// });

// // ─── Request interceptor ──────────────────────────────────
// adminApi.interceptors.request.use(
//   (config) => config,
//   (error) => Promise.reject(error),
// );

// // ─── Response interceptor ─────────────────────────────────
// adminApi.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const message = error.response?.data?.message || "Something went wrong";
//     return Promise.reject({ message, status: error.response?.status });
//   },
// );

// export default adminApi;
import axios from "axios";

// NOTE: deliberately NOT using VITE_API_URL here — that variable is shared
// with the regular user-facing api.js and points to ".../api" (no /admins
// suffix). Using it here would break admin requests. If you need this to
// be configurable per-environment later, introduce a separate
// VITE_ADMIN_API_URL variable instead of reusing VITE_API_URL.
const adminApi = axios.create({
  baseURL: "http://localhost:5000/api/admins",
  withCredentials: true,
});

// ─── Request interceptor ──────────────────────────────────
adminApi.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

// ─── Response interceptor ─────────────────────────────────
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "Something went wrong";
    return Promise.reject({ message, status: error.response?.status });
  },
);

export default adminApi;
