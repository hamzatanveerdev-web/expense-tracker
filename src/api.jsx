// src/api.js
import axios from "axios";

// Create Axios Instance
const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'https://expencetracker-backend.vercel.app/api',
});

// ------------------------
// Token Refresh Queue
// ------------------------
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ------------------------
// Authentication Helper Functions
// ------------------------
export const isAuthenticated = () => {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  return !!(accessToken && refreshToken);
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  window.location.href = "/login";
};

// ------------------------
// Add Access Token to Every Request
// ------------------------

API.interceptors.request.use(config => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config; // Always return config, even if token is missing
});
// ------------------------
// Response Interceptor
// ------------------------
API.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // 1. Check if token is being refreshed
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return API(originalRequest);
        });
      }

      isRefreshing = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const res = await axios.post(`${API.defaults.baseURL}/auth/refresh-token`, { refreshToken });
        
        if (!res.data || !res.data.accessToken) {
          throw new Error("Invalid refresh token response");
        }
        
        const newToken = res.data.accessToken;
        const newRefreshToken = res.data.refreshToken;
        
        localStorage.setItem("accessToken", newToken);
        
        // Update refresh token if provided by backend
        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
        }

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);

        return API(originalRequest); // Retry original request with new token
      } catch (err) {
        console.error("Token refresh failed:", err);
        processQueue(err, null);
        forceLogout(); // If refresh fails, logout
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ------------------------
// Logout Helper
// ------------------------
function forceLogout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  window.location.href = "/login";
}

export default API;
