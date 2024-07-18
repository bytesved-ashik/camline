import { REQUEST_STATUS } from "@/enums/requestStatus.enums";
import { Category } from "@/types/interfaces/category.interface";
import { IMatchedRequests } from "@/types/interfaces/matchedRequests.interface";
import { IPagination } from "@/types/interfaces/pagination.interface";
import { QueryData } from "@/types/interfaces/query.interface";
import { QueryRequestParam } from "@/types/interfaces/queryRequest.interface";
import { RequestParams } from "@/types/interfaces/scheduledPagination.interface";
import { AxiosResponse } from "axios";
import { METHODS } from "../enums/axios.enums";
import createApi from "../utils/axios";
import { IGetUpcomingSession } from "@/types/interfaces/sessionRequest.interface";

const sessionApi = createApi("/request");

export const getAllRequests = async (params: QueryRequestParam) => {
  const { data }: AxiosResponse<IPagination<QueryData>> = await sessionApi({
    method: METHODS.GET,
    params: params,
  });

  return data;
};

export const getRequestById = async (id: string) => {
  const { data } = await sessionApi({
    url: `/${id}`,
    method: METHODS.GET,
  });

  return data;
};

export const getRequestInPool = async (params?: RequestParams): Promise<IPagination<QueryData>> => {
  const { data } = await sessionApi({
    url: `/in-pool`,
    params: params,
    method: METHODS.GET,
  });

  return data;
};

export const getScheduledRequests = async (params: RequestParams): Promise<IPagination<IMatchedRequests>> => {
  const { data } = await sessionApi({
    url: `/scheduled`,
    method: METHODS.GET,
    params: params,
  });

  return data;
};

export const getAllMatchingRequests = async (params: RequestParams): Promise<IPagination<IMatchedRequests>> => {
  const { data } = await sessionApi({
    url: `/all`,
    method: METHODS.GET,
    params: params,
  });

  return data;
};

export const acceptNotificationFromPatient = async (requestData: { streamId: string; sessionId: string }) => {
  const { sessionId, streamId } = requestData;

  const { data } = await sessionApi({
    url: `/therapist/accept/${sessionId}`,
    data: { streamId },
    method: METHODS.POST,
  });

  return data;
};

export const createRequest = async (requestData: {
  requestType: string;
  requestStatus: REQUEST_STATUS;
  categories: Category["_id"][] | string[];
  query: string;
  minBudget: number;
  maxBudget: number;
}) => {
  const { data } = await sessionApi({
    url: `/create`,
    method: METHODS.POST,
    data: requestData,
  });

  return data;
};

export const resetRequestById = async (id: string) => {
  const { data } = await sessionApi({
    url: `/re-request/${id}`,
    method: METHODS.PATCH,
  });

  return data;
};

export const cancelRequestById = async (sessionId: string) => {
  const { data } = await sessionApi({
    url: `/cancel/${sessionId}`,
    method: METHODS.PATCH,
  });

  return data;
};
export const rejectRequestById = async (requestId: string) => {
  const { data } = await sessionApi({
    url: `/reject/${requestId}`,
    method: METHODS.POST,
  });

  return data;
};

export const withdrawRequestById = async (id: string) => {
  const { data } = await sessionApi({
    url: `/withdraw/${id}`,
    method: METHODS.PATCH,
  });

  return data;
};

export const updateRequestById = async ({ id, query }: { id: string; query: string }) => {
  const { data } = await sessionApi({
    url: `/${id}`,
    method: METHODS.PATCH,
    data: { query },
  });

  return data;
};

export const deleteRequestById = async (id: string) => {
  const { data } = await sessionApi({
    url: `/${id}`,
    method: METHODS.DELETE,
  });

  return data;
};

export const deleteAllRequest = async () => {
  const { data } = await sessionApi({
    url: `/withdraw-all-request`,
    method: METHODS.POST,
  });

  return data;
};

export const upcomingSession = async (requestData: { therapistId: string; startDate: string; duration: number }) => {
  const { data } = await sessionApi({
    url: `/create-schedule`,
    method: METHODS.POST,
    data: requestData,
  });

  return data;
};

export const upcomingTherapistScheduleSession = async (requestData: {
  userId: string;
  startDate: string;
  duration: number;
  streamId: string;
}) => {
  const { data } = await sessionApi({
    url: `/therapist-create-schedule`,
    method: METHODS.POST,
    data: requestData,
  });

  return data;
};

export const getUpcomingSessionApi = async (paramData?: IGetUpcomingSession): Promise<IPagination<IMatchedRequests>> => {
  const { data } = await sessionApi({
    url: `/scheduled`,
    method: METHODS.GET,
    params: paramData,
  });

  return data;
};

export const acceptIncomingSession = async (id: string, payload: any) => {
  const { data } = await sessionApi({
    url: `/therapist/accept/scheduled/${id}`,
    method: METHODS.POST,
    data: payload,
  });

  return data;
};

export const rejectIncomingSession = async (id: string) => {
  const { data } = await sessionApi({
    url: `/therapist/reject/scheduled/${id}`,
    method: METHODS.POST,
  });

  return data;
};
