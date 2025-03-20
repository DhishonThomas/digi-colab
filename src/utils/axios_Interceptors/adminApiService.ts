import axios from "axios";
import { ADMIN_URL } from "../constants";
import store from "@/store/store";
import { logout } from "@/store/slices/adminSlice";

const adminApi = axios.create({
  baseURL: ADMIN_URL,
  withCredentials: true,
});

// Request Interceptor 
adminApi.interceptors.request.use(
  (config) => {
    console.log("Config Headers:", config.headers);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 400)) {
      console.log("Unauthorized error:", error.response);
      
      store.dispatch(logout());
      window.location.href = "/admin/login";
    }

    return Promise.reject(error);
  }
);

export default adminApi;
