import axios from "axios";
import { USER_URL } from "../constants";
import store from "@/store/store";
import { logout } from "@/store/slices/userSlice";

const userApi = axios.create({
  baseURL: USER_URL,
  headers: { "Content-Type": "application/json" },
});

// Request Interceptor
userApi.interceptors.request.use(
  (config) => {
    const { token } = store.getState().user;
console.log("this is token", token);
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
userApi.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;

    // Token-related failure
    if (status === 401) {
      alert("Session expired. Please log in again.");

      store.dispatch(logout());
      window.location.href = "/login";
      return Promise.reject(new Error("Session expired. Please log in again."));
    }

    return Promise.reject(error);
  }
);

export default userApi;
