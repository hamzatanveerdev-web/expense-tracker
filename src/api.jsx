// src/api.js
import axios from "axios";

// Create Axios Instance
const API = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL}`,
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
// Add Access Token to Every Request
// ------------------------
API.interceptors.request.use(config => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// ------------------------
// Response Interceptor
// ------------------------
API.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue this request until token is refreshed
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return API(originalRequest);
        }).catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          forceLogout();
          return Promise.reject(error);
        }

        const res = await axios.post(`${API.defaults.baseURL}/auth/refresh-token`, { refreshToken });
        const newToken = res.data.accessToken;
        localStorage.setItem("accessToken", newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);

        return API(originalRequest);
      } catch (err) {
        processQueue(err, null);
        forceLogout();
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
  window.location.href = "/login";
}

export default API;
