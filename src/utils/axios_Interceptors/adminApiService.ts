import axios from "axios";
import { ADMIN_URL } from "../constants";
import store from "@/store/store";
import { logout } from "@/store/slices/adminSlice";

const adminApi = axios.create({
  baseURL: ADMIN_URL,
  headers: { "Content-Type": "application/json" },
});

// Request Interceptor
adminApi.interceptors.request.use(
  (config) => {
    const { token } = store.getState().admin;

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
adminApi.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      store.dispatch(logout());
      window.location.href = "/admin/login";
      return Promise.reject(new Error("Session expired. Please log in again."));
    }

    return Promise.reject(error);
  }
);

export default adminApi;
