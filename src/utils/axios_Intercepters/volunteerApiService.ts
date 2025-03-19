import axios from "axios";
import { VOLUNTEER_URL } from "../constants";
import store from "@/store/store";
import { logout } from "@/store/slices/volunteer";

const volunteerApi = axios.create({
  baseURL: VOLUNTEER_URL, 
  headers: { "Content-Type": "application/json" },
});

// Request Interceptor

volunteerApi.interceptors.request.use(
    (config) => {
      const { token } = store.getState().volunteer;
  
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
volunteerApi.interceptors.response.use(
    (response) => {
      return response;
    },
  
    (error) => {
      if (error.response && error.response.status === 401) {
        store.dispatch(logout());
            window.location.href = "/volunteer/login";
        
      }
  
      return Promise.reject(new Error("Session expired. Please log in again."));
    }
  );

export default volunteerApi;
