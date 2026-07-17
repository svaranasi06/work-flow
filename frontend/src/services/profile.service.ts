import api from "./api.service";

import type {
  ProfileResponse,
} from "../types/profile.types";

export const getMyProfile =
  async (): Promise<ProfileResponse> => {
    const response =
      await api.get<ProfileResponse>(
        "/profile"
      );

    return response.data;
  };