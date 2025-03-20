import axios from "axios";
import { USER_URL } from "../constants";
import store from "@/store/store";
import { logout } from "@/store/slices/userSlice";

const userApi = axios.create({
  baseURL: USER_URL,
  withCredentials: true, 
});

// Request Interceptor
userApi.interceptors.request.use(
  (config) => {
    console.log("User API Request Config:", config.headers);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
userApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 400)) {
      console.log("User session expired:", error.response);
      store.dispatch(logout());
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default userApi;
