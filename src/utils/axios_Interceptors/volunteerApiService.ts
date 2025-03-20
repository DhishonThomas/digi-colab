import axios from "axios";
import { VOLUNTEER_URL } from "../constants";
import store from "@/store/store";
import { logout } from "@/store/slices/volunteer";

const volunteerApi = axios.create({
  baseURL: VOLUNTEER_URL,
  withCredentials: true, 
});

// Request Interceptor
volunteerApi.interceptors.request.use(
  (config) => {
    console.log("Volunteer API Request Config:", config.headers);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
volunteerApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 400)) {
      console.log("Volunteer session expired:", error.response);
      store.dispatch(logout());
      window.location.href = "/volunteer/login";
    }
    return Promise.reject(error);
  }
);

export default volunteerApi;
