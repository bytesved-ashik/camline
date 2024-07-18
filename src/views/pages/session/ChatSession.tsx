import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { DialogContent, DialogTitle, IconButton, Skeleton, Typography } from "@mui/material";
import { Icon } from "@iconify/react";
import ChatLog from "../chat/ChatLog";
import SendMsgForm from "../chat/SendMsgForm";
import { useSession } from "next-auth/react";
import { useSessionData } from "@/store/sessionData/useSessionData";
import useSessionChat from "@/hooks/sessionChat/useChat";
import { useSocket } from "@/store/socket/useSocket";
import { ChatType } from "@/types/apps/chatTypes";
import { NOTIFICATION_TYPE } from "@/enums/messageTypes";
import { QueryAccepted } from "@/types/interfaces/queryAccepted.interface";
import { getSessionById } from "@/services/sessions.service";
import ScheduledSessionNotification from "@/components/ui/toasts/ScheduledSessionNotification";

type Anchor = "right";
type IProps = {
  chatSessionId?: string;
  right?: any;
  handleDrawerClose?: () => void;
  drawnOpen?: boolean;
};

const ChatSession = ({
  chatSessionId,
  right, //eslint-disable-line
  handleDrawerClose,
  drawnOpen,
}: IProps) => {
  const { data: session } = useSession();
  const { sessionId, sessionData } = useSessionData();
  const { chatData, isLoading, refetch } = useSessionChat(chatSessionId ? chatSessionId : sessionId);
  const [scheduledSessionData, setScheduledSessionData] = useState<QueryAccepted>();
  const [showScheduleDialogue, setShowScheduleDialogue] = useState<boolean>(false);

  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: drawnOpen,
  });
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

  const toggleDrawer = (anchor: Anchor, open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    refetch();
    open = true;
    if (
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (
    anchor: Anchor //eslint-disable-line
  ) => (
    <Box
      sx={{
        maxWidth: 380,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
      role="presentation"
    >
      <DialogTitle id="customized-dialog-title" sx={{ p: 4 }}>
        <Typography variant="h6" component="span">
          Chat
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleDrawerClose}
          sx={{ top: 10, right: 10, position: "absolute", color: "grey.500" }}
        >
          <Icon icon="clarity:close-line" />
        </IconButton>
      </DialogTitle>
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
              hidden={true}
              socket={socket}
              setShowScheduleDialogue={setShowScheduleDialogue}
              sessionId={chatSessionId ? chatSessionId : sessionId}
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
      <SendMsgForm sessionId={chatSessionId ? chatSessionId : sessionId} userId={sessionData?.attendees[0].user.id} />
    </Box>
  );

  return (
    <>
      {(["right"] as const).map((anchor) => (
        <React.Fragment key={anchor}>
          <Drawer
            anchor={anchor}
            open={drawnOpen}
            SlideProps={{ unmountOnExit: true }}
            onClose={toggleDrawer(anchor, false)}
            sx={{
              "& .MuiBackdrop-root": { backgroundColor: "transparent" },
              zIndex: "9999",
            }}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
      {showScheduleDialogue && scheduledSessionData ? (
        <ScheduledSessionNotification
          scheduledSessionData={scheduledSessionData}
          setShowScheduleDialogue={setShowScheduleDialogue}
        />
      ) : null}
    </>
  );
};

export default ChatSession;
