import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshSubscribers.push((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;
      const refreshToken = localStorage.getItem('refresh_token');

      if (refreshToken) {
        try {
          const res = await axios.post('http://localhost:5000/api/auth/refresh', {
            refresh_token: refreshToken,
          });

          const { access_token, refresh_token: new_refresh_token } = res.data.data;
          localStorage.setItem('access_token', access_token);
          if (new_refresh_token) {
            localStorage.setItem('refresh_token', new_refresh_token);
          }

          isRefreshing = false;
          onRefreshed(access_token);

          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          refreshSubscribers = [];
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/onboarding';
        }
      } else {
        isRefreshing = false;
        window.location.href = '/onboarding';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
