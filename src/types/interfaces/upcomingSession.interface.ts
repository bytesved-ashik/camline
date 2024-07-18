import { IAttendees } from "./queryAccepted.interface";
import { UserData } from "./user.interface";

export interface UpcomingSessionData {
  _id: string;
  therapist: UserData;
  sessionPrice: number;
  duration: number;
  sessionStartTime: string;
  sessionType: string;
  attendees: IAttendees[];
}
