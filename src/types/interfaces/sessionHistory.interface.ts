import { IAttendees } from "./queryAccepted.interface";

export interface SessionHistory {
  _id: string;
  therapist: Therapist;
  request: string;
  sessionStatus: string;
  sessionType: string;
  sessionPrice: number;

  attendees: IAttendees[];
  streamId: string;
  joinedAttendees: JoinedAttendee[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Therapist {
  _id: string;
  firstName: string;
  lastName: string;
  name: string;
  id: string;
}

export interface JoinedAttendee {
  user: string;
  joinedAs: string;
  joinedAt: string;
}
