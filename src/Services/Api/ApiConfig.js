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
    console.log(error.response.data.message === "incorrect email or password");

    if (error.response?.status === 401) {
      if (error.response.data.message === "incorrect email or password") {
        toast.error(error.response.data.message);
        return;
      } // if the error message is "incorrect email or password" make toast.error only else make toast "Unauthorized, Redirect to login"
      toast.error("Unauthorized, Redirect to login");
      localStorage.removeItem("token");
      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 2000);
    } // if you edit the token of user in localStorage, then the token will deleted and make Unauthorized and redirect to login page
    return Promise.reject(error);
  },
);

export default apiClient;
