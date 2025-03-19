import axios from "axios";
import { VOLUNTEER_URL } from "../constants";
import Cookies from "js-cookie";



const volunteerApi = axios.create({
  baseURL: VOLUNTEER_URL, 
  headers: { "Content-Type": "application/json" },
});

// Request Interceptor
volunteerApi.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor
volunteerApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      Cookies.remove("token");
      window.location.href = "/login"; // Redirect to login if unauthorized
    }
    return Promise.reject(error);
  }
);

export default volunteerApi;

