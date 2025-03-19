import axios from "axios";
import { USER_URL } from "../constants";


const userApi = axios.create({
  baseURL: USER_URL, 
  headers: { "Content-Type": "application/json" },
});

// Request Interceptor
userApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor
userApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login"; // Redirect to login if unauthorized
    }
    return Promise.reject(error);
  }
);

export default userApi;

