// ** MUI Imports
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";

// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** Type Import
import { Settings } from "src/@core/context/settingsContext";

// ** Components

import UserDropdown from "src/@core/layouts/components/shared-components/UserDropdown";

// ** Hooks
import { signIn, useSession } from "next-auth/react";
import { Button, Link } from "@mui/material";
import NotificationDropdown from "@/@core/layouts/components/shared-components/NotificationDropdown";
import { NOTIFICATION_TYPE } from "@/enums/messageTypes";
import { useSocket } from "@/store/socket/useSocket";
import { useEffect, useState } from "react";
import QueryRequest from "@/components/ui/toasts/QueryRequest";
import { ROLE } from "@/enums/role.enums";
import { QueryAccepted } from "@/types/interfaces/queryAccepted.interface";
import * as toast from "@/utils/toast";
import { QueryKeyString } from "@/enums/queryKey.enums";
import { useQueryClient } from "react-query";
import { SOUND } from "@/assets/mp3";

interface Props {
  hidden: boolean;
  settings: Settings;
  toggleNavVisibility: () => void;
  saveSettings: (values: Settings) => void;
}

const AppBarContent = (props: Props) => {
  // ** Props
  const { hidden, settings, toggleNavVisibility } = props;
  const { socket } = useSocket();
  const { data: session } = useSession();
  const [recivedNotification, setRecivedNotification] = useState<any>([]);
  const [requestAcceptedNotification, setRequestAcceptedNotification] = useState<QueryAccepted>();
  const [showRequestDialogue, setShowRequestDialogue] = useState<boolean>(false);
  const queryClient = useQueryClient();

  // TODO: Remove duplication of socket implementation in horizontal and vertical
  useEffect(() => {
    if (socket) {
      socket.on(NOTIFICATION_TYPE.FIFTEEN_MINUTES_LEFT, () => {
        toast.error("15 min is left for the Scheduled session ");
      });
    }

    return () => {
      socket?.off(NOTIFICATION_TYPE.FIFTEEN_MINUTES_LEFT);
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on(NOTIFICATION_TYPE.FIVE_MINUTES_LEFT, () => {
        toast.error("5 min is left for the Scheduled session ");
      });
    }

    return () => {
      socket?.off(NOTIFICATION_TYPE.FIVE_MINUTES_LEFT);
    };
  }, []);
  useEffect(() => {
    if (socket) {
      socket.on(NOTIFICATION_TYPE.ONE_MINUTES_LEFT, () => {
        toast.error("1 min is left for the Scheduled session ");
      });
    }

    return () => {
      socket?.off(NOTIFICATION_TYPE.ONE_MINUTES_LEFT);
    };
  }, []);
  useEffect(() => {
    if (!socket) return;
    socket.on(NOTIFICATION_TYPE.REQUEST_ACCEPTED, (data) => {
      if (data.sessionType === "request") setRequestAcceptedNotification(data);
      setRecivedNotification((prevData: any) => [...prevData, data]);
      setShowRequestDialogue(true);
      if (!("Notification" in window)) {
        console.log("Browser does not support desktop notification");
      } else {
        new Notification("Your query request has been accepted", {
          silent: false,
          renotify: true,
          tag: "renotify",
        });
        new Audio(SOUND.notificationSound).play();
      }
    });

    return () => {
      socket.off(NOTIFICATION_TYPE.REQUEST_ACCEPTED);
    };
  }, [socket]);
  useEffect(() => {
    if (!socket) return;
    if (session?.user.role !== ROLE.THERAPIST) return;
    socket.on(NOTIFICATION_TYPE.REQUEST_RECEIVED, (data) => {
      toast.success("You have a new request");
      queryClient.invalidateQueries(QueryKeyString.REQUEST_IN_POOL_DATA);
      console.log("the data from the REQUEST_RECEIVED", data);
      if (!("Notification" in window)) {
        console.log("Browser does not support desktop notification");
      } else {
        new Notification("You have a new request", {
          silent: false,
          renotify: true,
          tag: "renotify",
        });
        new Audio(SOUND.notificationSound).play();
      }
    });

    return () => {
      socket?.off(NOTIFICATION_TYPE.REQUEST_RECEIVED);
    };
  }, [queryClient, session?.user.role, socket]);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box className="actions-left" sx={{ mr: 2, display: "flex", alignItems: "center" }}>
        {hidden ? (
          <IconButton color="inherit" sx={{ ml: -2.75 }} onClick={toggleNavVisibility}>
            <Icon icon="mdi:menu" />
          </IconButton>
        ) : null}
      </Box>
      <Box className="actions-right" sx={{ display: "flex", alignItems: "center" }}>
        {session && session.user ? (
          <>
            <NotificationDropdown settings={settings} notifications={recivedNotification} />
            <UserDropdown settings={settings} />
          </>
        ) : (
          <>
            <Link
              onClick={() => signIn()}
              sx={{
                fontSize: "15px",
                cursor: "pointer",
                padding: {
                  xl: "0 20px",
                  lg: "0 16px",
                  xs: "0 10px",
                },
                textTransform: "uppercase",
              }}
            >
              Login
            </Link>
            <Button sx={{ paddingRight: "13px", cursor: "pointer" }} href="/auth/register">
              GET STARTED
              <Icon icon="material-symbols:arrow-forward-rounded" />
            </Button>
          </>
        )}
        {showRequestDialogue && session?.user.role === ROLE.USER && recivedNotification && requestAcceptedNotification ? (
          <QueryRequest requestAcceptedNotification={requestAcceptedNotification} />
        ) : null}
      </Box>
    </Box>
  );
};

export default AppBarContent;
