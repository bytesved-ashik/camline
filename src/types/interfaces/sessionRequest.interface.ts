export interface IGetSessionsRequest {
  limit?: number;
  q?: string;
  sort?: string;
  page?: number;
  sessionType?: string;
  sessionStatus?: string;
}

export interface IGetUpcomingSession {
  limit?: number;
  q?: string;
  sort?: string;
  page?: number;
  sessionType?: string;
}

export interface IReferalPayload {
  source?: string;
  referralCode: string;
}

export interface IGetReferalResponse {
  _id: string;
  referralCode: string;
  createdAt: string;
  updatedAt: string;
  source?: string;
}
