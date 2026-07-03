import axios from "axios";

// Scoped to /api/admin/carts — distinct from both adminApi (/api/admins)
// and dashboardApi (/api/dashboard). Same one-instance-per-resource pattern.
const adminCartApi = axios.create({
  baseURL: "http://localhost:5000/api/admin/carts",
  withCredentials: true,
});

adminCartApi.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

adminCartApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "Something went wrong";
    return Promise.reject({ message, status: error.response?.status });
  },
);

export default adminCartApi;
