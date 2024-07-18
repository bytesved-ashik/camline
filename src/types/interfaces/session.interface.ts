import { IAttendees } from "./queryAccepted.interface";
import { UserData } from "./user.interface";

export type ISession = {
  therapist: UserData;
  request: string;
  sessionStatus: string;
  sessionType: string;
  sessionPrice: number;
  duration: number;
  sessionStartTime: string;
  attendees: IAttendees[];
  streamId: string;
  tid: Itransaction;
  joinedAttendees: [{ user: string; joinedAs: string; joinedAt: string }];
  createdAt: string;
  updatedAt: string;
  sessionEndTime: string;
  _id: string;
  transcript: string;
  users: any;
};

export type Itransaction = {
  amount: number;
  commissionAmount: number;
  createdAt: string;
  holdedBonusBalance: number;
  holdedMainBalance: number;
  holdedTrialMinutes: number;
  remarks: string;
  status: string;
  therapist: string;
  therapistAmount: number;
  tid: string;
  type: string;
  updatedAt: string;
  user: string;
  VATCharge: number;
  therapistVATCharge: number;
  usedFreeTrialMinutes: number;
  platformVATCharge: number;
};

export type IScheduleSessionRequest = {
  duration: number;
  sessionStartTime: Date;
  id: string;
};
