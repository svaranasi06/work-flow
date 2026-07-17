import api from "./api.service";

import type {
  ApplyLeaveInput,
  ApplyLeaveResponse,
  CancelLeaveResponse,
  LeaveSummaryResponse,
  MyLeavesResponse,
} from "../types/leave.types";

export const getMyLeaves =
  async (): Promise<MyLeavesResponse> => {
    const response =
      await api.get<MyLeavesResponse>(
        "/leaves/my-leaves"
      );

    return response.data;
  };

export const getLeaveSummary = async (
  year: number
): Promise<LeaveSummaryResponse> => {
  const response =
    await api.get<LeaveSummaryResponse>(
      "/leaves/summary",
      {
        params: {
          year,
        },
      }
    );

  return response.data;
};

export const applyForLeave = async (
  leaveData: ApplyLeaveInput
): Promise<ApplyLeaveResponse> => {
  const response =
    await api.post<ApplyLeaveResponse>(
      "/leaves/apply",
      leaveData
    );

  return response.data;
};

export const cancelLeaveRequest = async (
  leaveRequestId: number
): Promise<CancelLeaveResponse> => {
  const response =
    await api.patch<CancelLeaveResponse>(
      `/leaves/${leaveRequestId}/cancel`
    );

  return response.data;
};