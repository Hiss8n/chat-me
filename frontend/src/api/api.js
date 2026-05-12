export const API_URL = "https://chatme-p0ah.onrender.com" ||"https://localhost:500/api ";

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://localhost:500/api",
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
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

export default axiosInstance;
