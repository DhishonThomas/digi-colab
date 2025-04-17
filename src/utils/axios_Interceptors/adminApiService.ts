import axios from "axios";
import { ADMIN_URL } from "../constants";
import store from "@/store/store";
import { logout } from "@/store/slices/adminSlice";

const adminApi = axios.create({
  baseURL: ADMIN_URL,
});

// Request Interceptor

adminApi.interceptors.request.use(
  (config) => {
    const { token } = store.getState().admin;
console.log(token,"this is the token)****")
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      console.log("config>>headers",config.headers)
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
    alert("Session expired. Please log in again.");

    if (error.response && error.response.status === 401||error.response.status===400) {
     console.log("error response",error.response)
     
      store.dispatch(logout());
      window.location.href = "/admin/login";
    }

    return Promise.reject(new Error("Session expired. Please log in again."));
  }
);

export default adminApi;
