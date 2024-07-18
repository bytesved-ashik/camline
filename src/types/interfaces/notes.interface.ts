export type INotesPost = {
  userId: string;
  notes: string;
  sessionId: string;
};

export type INotesResponse = {
  userId: string;
  therapistId: string;
  notes: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
};

export type IUsersNotes = {
  userId: string;
};

export type IUserNoteResponse = {
  sessionId: string | null;
  notes: INotesResponse[];
  session: ISession;
};

export type ISession = {
  _id: string;
  therapist: string;
  request: string;
  sessionStatus: string;
  isTherapistJoined: boolean;
  sessionPrice: number;
  duration: number;
  streamId: string;
  createdAt: string;
  updatedAt: string;
};
