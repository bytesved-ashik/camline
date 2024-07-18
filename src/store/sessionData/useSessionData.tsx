import { QueryAccepted } from "@/types/interfaces/queryAccepted.interface";
import { Dispatch, SetStateAction, createContext, useContext } from "react";

export interface ISessionState {
  setSessionId: Dispatch<SetStateAction<string>>;
  sessionId: string;
  sessionData?: QueryAccepted;
  setIsMuted: Dispatch<SetStateAction<boolean>>;
  isMuted: boolean;
  setIsCameraOn: Dispatch<SetStateAction<boolean>>;
  isCameraOn: boolean;
  setStreamId: Dispatch<SetStateAction<string>>;
  streamId: string;
  isTherapist: boolean;
  setIsTherapist: Dispatch<SetStateAction<boolean>>;
  isPreparing: boolean;
  setIsPreparing: Dispatch<SetStateAction<boolean>>;
  webRTCAdaptor: any;
  setWebRTCAdaptor: Dispatch<SetStateAction<any>>;
  remoteVideoOn: boolean;
  remoteAudioOn: boolean;
  joined: boolean;
  setJoined: Dispatch<SetStateAction<boolean>>;
  dataReceivedCallback: (data: any) => void;
  onDataChannelClosed: () => void;
  onDataChannelOpened: () => void;
  cameraFacingMode: "user" | "environment";
  setCameraFacingMode: Dispatch<SetStateAction<"user" | "environment">>;
}

export const SessionState = createContext<ISessionState>({} as ISessionState);
SessionState.displayName = "SessionState";

export function useSessionData() {
  return useContext(SessionState);
}
