import axios from "axios";
import { USER_URL } from "../constants";
import Cookies from "js-cookie";


const userApi = axios.create({
  baseURL: USER_URL, 
  headers: { "Content-Type": "application/json" },
});

// Request Interceptor
userApi.interceptors.request.use((config) => {
  const token = Cookies.get("token");
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
      Cookies.remove("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default userApi;

