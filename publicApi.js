import axios from "axios";

const publicApi = axios.create({
  baseURL: import.meta.env.VITE_PRODUCTS_API || "https://dummyjson.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default publicApi;