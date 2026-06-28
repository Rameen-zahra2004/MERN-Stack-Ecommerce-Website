import axios from "axios";

const publicApi = axios.create({
  baseURL: import.meta.env.VITE_PRODUCTS_API || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default publicApi;
