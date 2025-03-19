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
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
adminApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      store.dispatch(logout());

      window.location.href = "/admin/login";
    }

    return Promise.reject(new Error("Session expired. Please log in again."));
  }
);

export default adminApi;
