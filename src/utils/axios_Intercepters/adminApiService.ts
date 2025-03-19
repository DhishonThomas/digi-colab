import axios from "axios";
import Cookies from "js-cookie"; // Import js-cookie
import { ADMIN_URL } from "../constants";

const adminApi = axios.create({
  baseURL: ADMIN_URL, 
  headers: { "Content-Type": "application/json" },
});

// Request Interceptor
adminApi.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      Cookies.remove("token"); 
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default adminApi;
