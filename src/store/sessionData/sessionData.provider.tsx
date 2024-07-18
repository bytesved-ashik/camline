import { useState, PropsWithChildren, useMemo, useCallback, useEffect } from "react";
import { SessionState } from "./useSessionData";
import { QueryAccepted } from "@/types/interfaces/queryAccepted.interface";
import { useQuery } from "react-query";
import { QueryKeyString } from "@/enums/queryKey.enums";
import { getSessionById } from "@/services/sessions.service";
import { SESSION_EVENT } from "@/enums/sessionEvent.enum";
import { useSession } from "next-auth/react";

export function SessionDataProvider({ children }: PropsWithChildren) {
  const [isPreparing, setIsPreparing] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isCameraOn, setIsCameraOn] = useState<boolean>(true);
  const [streamId, setStreamId] = useState<string>("");
  const [isTherapist, setIsTherapist] = useState(true);
  const [joined, setJoined] = useState(false);
  const [webRTCAdaptor, setWebRTCAdaptor] = useState<any>(null);
  const [cameraFacingMode, setCameraFacingMode] = useState<"user" | "environment">("user");
  const { data: authSession } = useSession();

  const [remoteVideoOn, setRemoteVideoOn] = useState(true);
  const [remoteAudioOn, setRemoteAudioOn] = useState(true);

  const [dataChannelOpened, setDataChannelOpened] = useState(false);

  const { data } = useQuery<QueryAccepted>(
    [QueryKeyString.SESSION_DATA, sessionId, isPreparing],
    async () => getSessionById(sessionId),
    {
      enabled: Boolean(sessionId),
    }
  );

  const dataReceivedCallback = useCallback((data: { user: null | string; event: SESSION_EVENT }) => {
    switch (data.event) {
      case SESSION_EVENT.VIDEO_OFF:
        setRemoteVideoOn(false);
        break;
      case SESSION_EVENT.VIDEO_ON:
        setRemoteVideoOn(true);
        break;
      case SESSION_EVENT.AUDIO_ON:
        setRemoteAudioOn(true);
        break;
      case SESSION_EVENT.AUDIO_OFF:
        setRemoteAudioOn(false);
        break;
    }
  }, []);

  const onDataChannelOpened = useCallback(() => {
    setDataChannelOpened(true);
  }, []);
  const onDataChannelClosed = useCallback(() => {
    setDataChannelOpened(false);
  }, []);

  useEffect(() => {
    if (webRTCAdaptor && dataChannelOpened) {
      webRTCAdaptor.sendData(
        streamId,
        JSON.stringify({
          user: authSession?.user._id,
          event: isCameraOn ? SESSION_EVENT.VIDEO_ON : SESSION_EVENT.VIDEO_OFF,
        })
      );

      webRTCAdaptor.sendData(
        streamId,
        JSON.stringify({
          user: authSession?.user._id,
          event: isMuted ? SESSION_EVENT.AUDIO_OFF : SESSION_EVENT.AUDIO_ON,
        })
      );
    }
  }, [authSession?.user._id, dataChannelOpened, isCameraOn, isMuted, streamId, webRTCAdaptor]);

  const value = useMemo(
    () => ({
      isPreparing,
      setIsPreparing,
      setSessionId,
      sessionId,
      sessionData: data,
      setIsMuted,
      isMuted,
      setIsCameraOn,
      isCameraOn,
      setStreamId,
      streamId,
      setIsTherapist,
      isTherapist,
      webRTCAdaptor,
      setWebRTCAdaptor,
      dataReceivedCallback,
      onDataChannelClosed,
      onDataChannelOpened,
      remoteVideoOn,
      remoteAudioOn,
      setJoined,
      joined,
      cameraFacingMode,
      setCameraFacingMode,
    }),
    [
      isPreparing,
      sessionId,
      data,
      isMuted,
      isCameraOn,
      streamId,
      isTherapist,
      webRTCAdaptor,
      dataReceivedCallback,
      onDataChannelClosed,
      onDataChannelOpened,
      remoteVideoOn,
      remoteAudioOn,
      joined,
      cameraFacingMode,
      setCameraFacingMode,
    ]
  );

  return <SessionState.Provider value={value}>{children}</SessionState.Provider>;
}
