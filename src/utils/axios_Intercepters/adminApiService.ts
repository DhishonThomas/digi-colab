import axios from "axios";
import { ADMIN_URL } from "../constants";

const adminApi = axios.create({
  baseURL: ADMIN_URL, 
  headers: { "Content-Type": "application/json" },
});

// Request Interceptor
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login"; // Redirect to login if unauthorized
    }
    return Promise.reject(error);
  }
);

export default adminApi;

