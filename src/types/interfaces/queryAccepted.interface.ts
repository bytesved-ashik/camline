export interface QueryAccepted {
  therapist: Therapist;
  request: string;
  sessionStatus: string;
  sessionType: string;
  sessionPrice: number;
  attendees: IAttendees[];
  streamId: string;
  joinedAttendees: JoinedAttendee[];
  duration: number;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  acceptedBy: AcceptedBy;
  id: string;
  isTherapistJoined: boolean;
  sessionEndTime: string;
  sessionStartTime: string;
}

export interface JoinedAttendee {
  user: string;
  joinedAs: string;
  joinedAt: string;
  pingedAt: string;
  isJoined: boolean;
}

interface Therapist {
  firstName: string;
  id: string;
  lastName: string;
  name: string;
  _id: any;
}
export interface IAttendees {
  user: {
    firstName: string;
    id: string;
    lastName: string;
    name: string;
    _id: string;
  };
  isJoined: boolean;
}
interface ProfileData {
  bio?: string;
  _id: string;
}

export interface AcceptedBy {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  roles: string[];
  status: string;
  isOnline: boolean;
  createdAt: string;
  updatedAt: string;
  clientId: string;
  name: string;
  id: string;
  role: string;
  profile?: ProfileData;
}
