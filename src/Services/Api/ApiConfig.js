import axios from "axios";
import { toast } from "react-toastify";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      toast.error("Unauthorized, Redirect to login");
      localStorage.removeItem("token");
      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 2000);
    }
    return Promise.reject(error);
  },
);

export default apiClient;
