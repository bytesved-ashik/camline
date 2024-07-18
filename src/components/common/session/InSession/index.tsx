import { Drawer, IconButton, Divider } from "@mui/material";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ChatSession from "src/views/pages/session/ChatSession";
import SessionSettings from "src/components/ui/dialogs/SessionSettings";
import { NOTIFICATION_TYPE } from "@/enums/messageTypes";
import { useSessionData } from "@/store/sessionData/useSessionData";
import { useSocket } from "@/store/socket/useSocket";
import { Ping } from "@/types/interfaces/ping.interface";
import { useRouter } from "next/router";
import * as toast from "@/utils/toast";
import { useSession } from "next-auth/react";
import { ROLE } from "@/enums/role.enums";
import { getChatSession } from "@/services/chat.service";
import { IGetChatData } from "@/types/apps/chatTypes";
import { styled, useTheme } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SessionNote from "@/views/pages/session/SessionNote";
import { joinSessionAsUser, leaveSession, startRecording } from "@/services/sessions.service";
import { DEFAULT_ROUTE } from "@/enums/defaultRoute.enums";
import ScheduleCallModal from "../../userlist/ScheduleCallModal";

interface IframeProps {
  src: string;
}

const IframeComponent = React.memo(({ src }: IframeProps) => {
  return (
    <iframe
      src={src}
      style={{
        borderRadius: "20px",
        width: "99vw",
        height: "100vh",
      }}
      allow=" microphone;camera"
    />
  );
});

const InSession = () => {
  const { sessionData, sessionId } = useSessionData();
  const { streamId, isTherapist } = useSessionData();
  const { pathname, push } = useRouter();
  const [dashBoardPath, setDashBoardPath] = useState(DEFAULT_ROUTE["user"]);
  const [therapistId, setTherapistId] = useState<string>("");
  const mStreamId = useMemo(() => {
    return streamId;
  }, []);

  const mIsTherapist = useMemo(() => {
    return isTherapist;
  }, []);

  const router = useRouter();
  const { data: session } = useSession();
  const [chatSessionId, setChatSessionId] = useState<string>("");
  const converteData = session ? btoa(JSON.stringify(session)) : "";
  let self: any;
  let remote: any;

  useEffect(() => {
    if (sessionData && mIsTherapist) {
      self = sessionData?.attendees[0]?.user?.name;
      remote = sessionData?.therapist?.name;
    } else {
      remote = sessionData?.attendees[0]?.user?.name;
      self = sessionData?.therapist?.name;
      if (sessionId) {
        joinSessionAsUser(sessionId);
      }
    }
  }, [sessionData, sessionId]);

  const ping: Ping = useMemo(
    () => ({
      session: sessionId,
    }),
    [sessionId]
  );

  useEffect(() => {
    if (session && session.user) return setDashBoardPath(DEFAULT_ROUTE[session.user.role]);
  }, [session]);

  useEffect(() => {
    if (!sessionData) return;
    const id = session?.user.role === ROLE.THERAPIST ? sessionData.attendees[0].user.id : sessionData.therapist._id;
    getChatSession(id).then((data: IGetChatData) => {
      setChatSessionId(data.chatSessionId);
    });
  }, [sessionData, sessionId]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [iframeUrl, setIframeUrl] = useState(
    `https://call.24hrtherapy.co.uk/?roomId=${sessionId}&userdata=${converteData}&self=${self}&remote=${remote}`
  );

  useEffect(() => {
    setIframeUrl(
      `https://call.24hrtherapy.co.uk/?roomId=${sessionId}&userdata=${converteData}&isTherapist=${mIsTherapist}&self=${self}&remote=${remote}`
    );
  }, [sessionData, sessionId, mIsTherapist]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (sessionId && sessionData && sessionData.attendees[0].isJoined == false) {
      const payload = {
        streamId: sessionId,
        url: `https://streaming.24hrtherapy.co.uk/LiveApp/multitrack-play.html?id=${sessionId}&muted=false`,
      };
      startRecording(payload)
        .then(() => {
          console.log("Recording Start");
        })
        .catch(() => {
          console.log("Recording Stop");
        });
    }
  }, [sessionId]);

  const handleNoteClose = () => {
    setNoteOpen(false);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleNoteOpen = () => {
    setNoteOpen(true);
  };

  const { socket } = useSocket();
  useEffect(() => {
    // Log all socket events
    if (socket) {
      socket.onAny((event) => {
        if (event == "session-ended") {
          toast.error("Session Ended");
          if (pathname.includes("session")) {
            push(dashBoardPath);
          }
        }
        if (event == "user-insufficient-balance") {
          handleEndSession(sessionId);
        }
      });
    }

    // Clean up the event listener
    return () => {
      if (socket) {
        socket.offAny();
      }
    };
  }, [dashBoardPath, socket]);

  const handleEndSession = useCallback(
    async (sessionId: string) => {
      if (sessionId) {
        leaveSession(sessionId)
          .then(() => {
            if (session) {
              router.push(DEFAULT_ROUTE[session.user.role]);
            }
          })
          .catch((error) => {
            console.error("Error leaving session:", error);
          });
      }
    },
    [router, sessionData, sessionId]
  );

  useEffect(() => {
    if (socket && mIsTherapist && session) {
      socket.on(NOTIFICATION_TYPE.REQUEST_REJECTED, (data: any) => {
        if (data === null || data._id !== sessionId) {
          return;
        }
        toast.error("The session has been cancled by the user. You will be shortly redirected to the dashboard.");
      });
    }

    return () => {
      socket?.off(NOTIFICATION_TYPE.REQUEST_REJECTED);
    };
  }, [handleEndSession, mIsTherapist, session, sessionId, socket]);

  useEffect(() => {
    if (socket)
      socket.on(NOTIFICATION_TYPE.USER_INSUFFICIENT_BALANCE, () => {
        handleEndSession(sessionId);
      });

    return () => {
      socket?.off(NOTIFICATION_TYPE.USER_INSUFFICIENT_BALANCE);
    };
  }, [socket]);

  useEffect(() => {
    if (socket)
      socket.on(NOTIFICATION_TYPE.USER_NOT_RESPONDING, (data: any) => {
        console.log("user not responde => ", data);
      });

    return () => {
      socket?.off(NOTIFICATION_TYPE.USER_NOT_RESPONDING);
    };
  }, [socket]);

  useEffect(() => {
    if (socket)
      socket.on(NOTIFICATION_TYPE.USER_JOINED, (data: any) => {
        if (data.user._id !== session?.user._id) toast.success(`${data.user.name} has Joined`);
      });

    return () => {
      socket?.off(NOTIFICATION_TYPE.USER_JOINED);
    };
  }, [session?.user._id, socket, mStreamId]);

  useEffect(() => {
    let interval: NodeJS.Timer | null = null;

    if (socket) {
      socket.onAny((event) => {
        if (event == "user-insufficient-balance") {
          handleEndSession(sessionId);
          if (interval) {
            clearInterval(interval);
          }

          return;
        }
      });

      interval = setInterval(() => {
        socket.emit("ping", ping);
      }, 5000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [socket, ping]);

  useEffect(() => {
    if (socket) {
      socket.on("pong", () => {
        console.log("pong");
      });
    }
  }, [socket]);

  const handleHide = () => {
    setShow(false);
  };

  const handleOpenModal = (data: any) => {
    setTherapistId(data);
  };

  const handleMessage = useCallback(
    (event: any) => {
      if (event.data === "24HoursTherapist-fullScreen") {
      } else if (event.data === "24HoursTherapist-endSession") {
        handleEndSession(sessionId);
      } else if (event.data === "24HoursTherapist-chatBox") {
        setDrawerOpen(true);
      } else if (event.data === "24HoursTherapist-setting") {
        setShow(true);
      } else if (event.data === "24HoursTherapist-handRaise") {
        console.log("hand Shown");
      } else if (event.data === "24HoursTherapist-noteEdit") {
        handleNoteOpen();
      } else if (event.data === "24HoursTherapist-calender") {
        handleOpenModal(sessionData && sessionData.attendees[0]?.user?._id);
      }
    },
    [sessionId]
  );

  window.addEventListener("message", handleMessage);
  const theme = useTheme();

  const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-start",
  }));

  const videoUrl = useMemo(() => iframeUrl, [iframeUrl]);

  const handleCloseModal = () => {
    setTherapistId("");
  };

  return (
    <>
      <SessionSettings onClose={handleHide} show={show} videoRef={videoRef} />

      <IframeComponent src={videoUrl} />

      <Drawer
        sx={{
          width: "380",
        }}
        variant="persistent"
        anchor="right"
        open={drawerOpen}
      >
        <DrawerHeader style={{ zIndex: "9999" }}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <ChatSession
          chatSessionId={chatSessionId}
          right={"right"}
          handleDrawerClose={handleDrawerClose}
          drawnOpen={drawerOpen}
        />
      </Drawer>

      <ScheduleCallModal
        showDialog={therapistId ? true : false}
        closeDialog={handleCloseModal}
        therapistId={therapistId}
        therapistCall={true}
      />

      <SessionNote
        userId={sessionData ? sessionData.attendees[0].user.id : ""}
        sessionId={sessionId}
        noteOpen={noteOpen}
        handleNoteClose={handleNoteClose}
      />
    </>
  );
};

export default InSession;
