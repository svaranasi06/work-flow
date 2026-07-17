import api from "./api.service";

import type {
  LoginCredentials,
  LoginResponse,
  LogoutResponse,
  RefreshTokenResponse,
} from "../types/auth.types";

export const loginUser = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    "/auth/login",
    credentials
  );

  return response.data;
};

export const refreshUserSession =
  async (): Promise<RefreshTokenResponse> => {
    const response = await api.get<RefreshTokenResponse>(
      "/auth/refresh-token"
    );

    return response.data;
  };

export const logoutUser =
  async (): Promise<LogoutResponse> => {
    const response = await api.post<LogoutResponse>(
      "/auth/logout"
    );

    return response.data;
  };