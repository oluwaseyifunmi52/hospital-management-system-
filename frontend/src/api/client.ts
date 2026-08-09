import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const stored = localStorage.getItem('auth_tokens');
    if (stored) {
      try {
        const tokens = JSON.parse(stored);
        if (tokens.accessToken) {
          config.headers.Authorization = `Bearer ${tokens.accessToken}`;
        }
      } catch {
        // ignore
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

const refreshAccessToken = async (): Promise<string> => {
  const stored = localStorage.getItem('auth_tokens');
  if (!stored) {
    throw new Error('No refresh token available');
  }

  const { refreshToken } = JSON.parse(stored);
  const baseURL = api.defaults.baseURL?.replace(/\/api\/v1$/, '') || 'http://localhost:5000';
  const response = await axios.post(`${baseURL}/api/v1/auth/refresh-token`, { refreshToken });

  const newTokens = {
    accessToken: response.data.data.accessToken,
    refreshToken: response.data.data.refreshToken || refreshToken,
  };

  localStorage.setItem('auth_tokens', JSON.stringify(newTokens));
  api.defaults.headers.common.Authorization = `Bearer ${newTokens.accessToken}`;

  return newTokens.accessToken;
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('auth_tokens');
        localStorage.removeItem('auth_user');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    const errorData = error.response?.data as { message?: string; errors?: Array<{ field: string; message: string }> } | undefined;
    const message =
      errorData?.message ||
      errorData?.errors?.[0]?.message ||
      error.message ||
      'Something went wrong';

    return Promise.reject(new Error(message));
  }
);

export default api;
