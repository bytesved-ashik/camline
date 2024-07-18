// ** MUI Imports
import { v4 as uuidv4 } from "uuid";
import { Button, Link } from "@mui/material";
import Box from "@mui/material/Box";

// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** Type Import
import { Settings } from "src/@core/context/settingsContext";

// ** Components

import UserDropdown from "src/@core/layouts/components/shared-components/UserDropdown";

import { NOTIFICATION_TYPE } from "@/enums/messageTypes";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import NotificationDropdown from "src/@core/layouts/components/shared-components/NotificationDropdown";
import { useSocket } from "@/store/socket/useSocket";
import QueryRequest from "@/components/ui/toasts/QueryRequest";
import { ROLE } from "@/enums/role.enums";
import { QueryAccepted } from "@/types/interfaces/queryAccepted.interface";
import * as toast from "@/utils/toast";
import { useQueryClient } from "react-query";
import { QueryKeyString } from "@/enums/queryKey.enums";
import useUserQueries from "@/hooks/session/useUserQueries";
import { useCustomMutation } from "@/hooks/useCustomMutation";
import { acceptNotificationFromPatient } from "@/services/session.service";
import { useRouter } from "next/router";
import { defaultTherapistId } from "@/enums/defaultId.enums";
import { SOUND } from "@/assets/mp3";

interface Props {
  settings: Settings;
  saveSettings: (values: Settings) => void;
}

const AppBarContent = (props: Props) => {
  const queryRequestParams = {
    sort: "createdAt:desc",
    limit: 5,
    page: 1,
  };

  // ** Props
  const { settings } = props;
  const { data: session } = useSession();
  const router = useRouter();
  const { refetch } = useUserQueries(queryRequestParams);
  const { socket } = useSocket();
  const [recivedNotification, setRecivedNotification] = useState<any>([]);
  const [requestAcceptedNotification, setRequestAcceptedNotification] = useState<QueryAccepted>();
  const [showRequestDialogue, setShowRequestDialogue] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const { mutate: acceptNotification } = useCustomMutation({
    api: acceptNotificationFromPatient,
    onSuccess: (res) => {
      router.push({
        pathname: `/session/${res._id}`,
      });
    },
    onError: () => {
      refetch();
    },
  });
  useEffect(() => {
    if (socket) {
      socket.on(NOTIFICATION_TYPE.FIFTEEN_MINUTES_LEFT, () => {
        toast.success("15 min is left for the Scheduled session ");
      });
    }

    return () => {
      socket?.off(NOTIFICATION_TYPE.FIFTEEN_MINUTES_LEFT);
    };
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on(NOTIFICATION_TYPE.FIVE_MINUTES_LEFT, () => {
        toast.success("5 min is left for the Scheduled session ");
      });
    }

    return () => {
      socket?.off(NOTIFICATION_TYPE.FIVE_MINUTES_LEFT);
    };
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on(NOTIFICATION_TYPE.ONE_MINUTES_LEFT, () => {
        toast.success("1 min is left for the Scheduled session ");
      });
    }

    return () => {
      socket?.off(NOTIFICATION_TYPE.ONE_MINUTES_LEFT);
    };
  }, [socket]);
  useEffect(() => {
    if (!socket) return;
    socket.on(NOTIFICATION_TYPE.REQUEST_ACCEPTED, (data) => {
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
      if (data.therapist === defaultTherapistId) return;
      if (data.sessionType === "request") setRequestAcceptedNotification(data);
      refetch();
      setRecivedNotification((prevData: any) => [...prevData, data]);
      setShowRequestDialogue(true);
    });

    return () => {
      socket.off(NOTIFICATION_TYPE.REQUEST_ACCEPTED);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;
    if (session?.user.role !== ROLE.THERAPIST) return;
    socket.on(NOTIFICATION_TYPE.REQUEST_RECEIVED, (data: QueryAccepted) => {
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
      if (session.user.id === defaultTherapistId) {
        const streamId = uuidv4();
        acceptNotification({ streamId, sessionId: data._id });
      }
      queryClient.invalidateQueries(QueryKeyString.REQUEST_IN_POOL_DATA);
      toast.success("You have a new request");
    });

    return () => {
      socket?.off(NOTIFICATION_TYPE.REQUEST_RECEIVED);
    };
  }, [queryClient, session?.user.role, socket]);

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
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
          <Button
            sx={{
              paddingRight: "13px",
              cursor: "pointer",
            }}
            href="/auth/register"
          >
            GET STARTED <Icon icon="material-symbols:arrow-forward-rounded" />
          </Button>
        </>
      )}
      {showRequestDialogue && session?.user.role === ROLE.USER && recivedNotification && requestAcceptedNotification ? (
        <QueryRequest requestAcceptedNotification={requestAcceptedNotification} />
      ) : null}
    </Box>
  );
};

export default AppBarContent;
