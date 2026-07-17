import api from "./api.service";

import type {
  HrActionInput,
  HrActionResponse,
  HrPendingLeavesResponse,
  ManagerActionInput,
  ManagerActionResponse,
  ManagerPendingLeavesResponse,
} from "../types/approval.types";

export const getManagerPendingLeaves =
  async (): Promise<ManagerPendingLeavesResponse> => {
    const response =
      await api.get<ManagerPendingLeavesResponse>(
        "/leaves/manager/pending"
      );

    return response.data;
  };

export const approveLeaveByManager = async (
  leaveRequestId: number,
  actionData: ManagerActionInput
): Promise<ManagerActionResponse> => {
  const response =
    await api.post<ManagerActionResponse>(
      `/leaves/manager/${leaveRequestId}/approve`,
      actionData
    );

  return response.data;
};

export const rejectLeaveByManager = async (
  leaveRequestId: number,
  actionData: ManagerActionInput
): Promise<ManagerActionResponse> => {
  const response =
    await api.post<ManagerActionResponse>(
      `/leaves/manager/${leaveRequestId}/reject`,
      actionData
    );

  return response.data;
};

export const getHrPendingLeaves =
  async (): Promise<HrPendingLeavesResponse> => {
    const response =
      await api.get<HrPendingLeavesResponse>(
        "/leaves/hr/pending"
      );

    return response.data;
  };

export const approveLeaveByHr = async (
  leaveRequestId: number,
  actionData: HrActionInput
): Promise<HrActionResponse> => {
  const response =
    await api.post<HrActionResponse>(
      `/leaves/hr/${leaveRequestId}/approve`,
      actionData
    );

  return response.data;
};

export const rejectLeaveByHr = async (
  leaveRequestId: number,
  actionData: HrActionInput
): Promise<HrActionResponse> => {
  const response =
    await api.post<HrActionResponse>(
      `/leaves/hr/${leaveRequestId}/reject`,
      actionData
    );

  return response.data;
};