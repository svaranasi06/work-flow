import axios from "axios";

import type {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "./token.service";
import type {
  ApiErrorResponse,
  RefreshTokenResponse,
} from "../types/auth.types";

interface RetryableRequestConfig
  extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const baseURL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshPromise: Promise<string> | null = null;

const requestNewAccessToken = async (): Promise<string> => {
  const response = await axios.get<RefreshTokenResponse>(
    `${baseURL}/auth/refresh-token`,
    {
      withCredentials: true,
    }
  );

  const newAccessToken = response.data.data.accessToken;

  setAccessToken(newAccessToken);

  return newAccessToken;
};

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = getAccessToken();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,

  async (
    error: AxiosError<ApiErrorResponse>
  ) => {
    const originalRequest =
      error.config as RetryableRequestConfig | undefined;

    const isUnauthorized =
      error.response?.status === 401;

    const isAuthenticationRequest =
      originalRequest?.url?.includes("/auth/login") ||
      originalRequest?.url?.includes("/auth/refresh-token") ||
      originalRequest?.url?.includes("/auth/logout");

    if (
      !isUnauthorized ||
      !originalRequest ||
      originalRequest._retry ||
      isAuthenticationRequest
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = requestNewAccessToken().finally(
          () => {
            refreshPromise = null;
          }
        );
      }

      const newAccessToken = await refreshPromise;

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      clearAccessToken();

      window.dispatchEvent(
        new CustomEvent("auth:session-expired")
      );

      return Promise.reject(refreshError);
    }
  }
);

export default api;