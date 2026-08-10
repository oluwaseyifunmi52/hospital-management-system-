import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

function getStoredTokens(): { accessToken: string; refreshToken: string } | null {
  const stored = localStorage.getItem('auth_tokens');
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const tokens = getStoredTokens();
    if (tokens?.accessToken) {
      if (isTokenExpired(tokens.accessToken)) {
        return Promise.reject(new Error('Token expired'));
      }
      config.headers.Authorization = `Bearer ${tokens.accessToken}`;
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
  const tokens = getStoredTokens();
  if (!tokens?.refreshToken) {
    throw new Error('No refresh token available');
  }

  const baseURL = api.defaults.baseURL?.replace(/\/api\/v1$/, '') || 'http://localhost:5000';
  const response = await axios.post(`${baseURL}/api/v1/auth/refresh-token`, {
    refreshToken: tokens.refreshToken,
  });

  const newTokens = {
    accessToken: response.data.data.accessToken,
    refreshToken: response.data.data.refreshToken || tokens.refreshToken,
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