import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DialogContent, Skeleton } from "@mui/material";
import ChatLog from "../chat/ChatLog";
import SendMsgForm from "../chat/SendMsgForm";
import { useSession } from "next-auth/react";
import { useSessionData } from "@/store/sessionData/useSessionData";
import useSessionChat from "@/hooks/sessionChat/useChat";
import { useSocket } from "@/store/socket/useSocket";
import { ChatType, IAllChats } from "@/types/apps/chatTypes";
import { NOTIFICATION_TYPE } from "@/enums/messageTypes";
import { QueryAccepted } from "@/types/interfaces/queryAccepted.interface";
import { getSessionById } from "@/services/sessions.service";
import ScheduledSessionNotification from "@/components/ui/toasts/ScheduledSessionNotification";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ProfileButton from "@/components/chatsTab/ProfileButton";
import { isMobile } from "react-device-detect";
import { ROLE } from "@/enums/role.enums";

type Props = {
  chatKey?: string;
  profileDetail?: IAllChats;
};

const PublicChatSession = ({ chatKey, profileDetail }: Props) => {
  const { data: session } = useSession();
  const { sessionId, setSessionId } = useSessionData();
  const { chatData, isLoading, refetch } = useSessionChat(sessionId, chatKey);
  const [scheduledSessionData, setScheduledSessionData] = useState<QueryAccepted>();
  const [showScheduleDialogue, setShowScheduleDialogue] = useState<boolean>(false);

  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;
    const messageListener = (data: ChatType) => {
      if (!data) return;
      refetch();
    };
    socket.on(NOTIFICATION_TYPE.CHAT, messageListener);

    return () => {
      socket.off(NOTIFICATION_TYPE.CHAT, messageListener);
    };
  }, []);
  useEffect(() => {
    if (socket)
      socket.on(NOTIFICATION_TYPE.SCHEDULED_SESSION_ACCEPTED, (data) => {
        //FIXME: fetch data on the socket.
        getSessionById(data._id).then((res) => {
          setScheduledSessionData(res);
          refetch();
        });
        setShowScheduleDialogue(true);
      });

    return () => {
      socket?.off(NOTIFICATION_TYPE.SCHEDULED_SESSION_ACCEPTED);
    };
  }, [socket]);
  useEffect(() => {
    if (socket)
      socket.on(NOTIFICATION_TYPE.SESSION_SCHEDULED, (data: QueryAccepted) => {
        getSessionById(data._id).then((res) => {
          setScheduledSessionData(res);
          refetch();
        });
        setShowScheduleDialogue(true);

        //FIXME: fetch data on the socket.
      });

    return () => {
      socket?.off(NOTIFICATION_TYPE.SESSION_SCHEDULED);
    };
  }, [socket]);

  useEffect(() => {
    if (socket)
      socket.on(NOTIFICATION_TYPE.SCHEDULED_SESSION_REJECTED, (data) => {
        //FIXME: fetch data on the socket.
        getSessionById(data._id).then((res) => {
          setScheduledSessionData(res);
          refetch();
        });

        setShowScheduleDialogue(true);
      });

    return () => {
      socket?.off(NOTIFICATION_TYPE.SCHEDULED_SESSION_REJECTED);
    };
  }, [socket]);

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "75vh",
          display: "flex",
          flexDirection: "column",
        }}
        role="presentation"
      >
        <Box
          sx={{
            display: "flex",
            gap: "10px",
            "@media screen and (max-width: 767px)": {
              alignItems: "center",
            },
          }}
        >
          {isMobile && (
            <>
              <ArrowBackIosIcon onClick={() => setSessionId("")} sx={{ cursor: "pointer" }}></ArrowBackIosIcon>
              <ProfileButton
                selectedProfileId={sessionId}
                onSelectProfile={() => {
                  return;
                }}
                profile={profileDetail}
                isCallingChatView={true}
              />
            </>
          )}
        </Box>
        <DialogContent sx={{ p: 4 }}>
          <Box sx={{ height: "100%", overflowY: "auto" }}>
            {isLoading ? (
              <>
                <Skeleton variant="text" width={"90%"} height={"4rem"} sx={{ margin: "0 auto" }} />
                <Skeleton variant="text" width={"90%"} height={"4rem"} sx={{ margin: "0 auto" }} />
                <Skeleton variant="text" width={"90%"} height={"4rem"} sx={{ margin: "0 auto" }} />
                <Skeleton variant="text" width={"90%"} height={"4rem"} sx={{ margin: "0 auto" }} />
                <Skeleton variant="text" width={"90%"} height={"4rem"} sx={{ margin: "0 auto" }} />
                <Skeleton variant="text" width={"90%"} height={"4rem"} sx={{ margin: "0 auto" }} />
              </>
            ) : (
              <ChatLog
                refetch={refetch}
                chatKey={chatKey}
                hidden={true}
                socket={socket}
                setShowScheduleDialogue={setShowScheduleDialogue}
                data={{
                  chat: {
                    id: 1,
                    userId: 1,
                    chat: chatData,
                    unseenMsgs: 1,
                    lastMessage: undefined,
                  },
                  contact: {
                    id: 2,
                    role: "",
                    about: "",
                    avatar: undefined,
                    fullName: "",
                    status: "busy",
                    avatarColor: undefined,
                  },
                  userContact: {
                    id: session?.user._id,
                    role: session?.user.role,
                    about: "",
                    avatar: "",
                    fullName: `${session?.user.firstName} ${session?.user.lastName}`,
                    status: session?.user.status,
                    settings: {
                      isNotificationsOn: false,
                      isTwoStepAuthVerificationEnabled: false,
                    },
                  },
                }}
              />
            )}
          </Box>
        </DialogContent>
        <SendMsgForm
          sessionId={sessionId}
          userId={profileDetail?.users?.filter((val) => val.roles[0] === ROLE.USER)[0]._id}
        />
      </Box>
      {showScheduleDialogue && scheduledSessionData ? (
        <ScheduledSessionNotification
          scheduledSessionData={scheduledSessionData}
          setShowScheduleDialogue={setShowScheduleDialogue}
        />
      ) : null}
    </>
  );
};

export default PublicChatSession;
