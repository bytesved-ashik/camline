// ** React Imports
import { ReactNode, useEffect, useState } from "react";
import * as toast from "@/utils/toast";

// ** MUI Imports
import { Theme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

// ** Layout Imports
// !Do not remove this Layout import
import Layout from "src/@core/layouts/Layout";

// ** Navigation Imports
import VerticalNavItems from "src/navigation/vertical";
import HorizontalNavItems from "src/navigation/horizontal";

// ** Component Import
// Uncomment the below line (according to the layout type) when using server-side menu
// import ServerSideVerticalNavItems from './components/vertical/ServerSideNavItems'
// import ServerSideHorizontalNavItems from './components/horizontal/ServerSideNavItems'

import VerticalAppBarContent from "./components/vertical/AppBarContent";
import HorizontalAppBarContent from "./components/horizontal/AppBarContent";

// ** Hook Import

import { useSettings } from "src/@core/hooks/useSettings";
import { useSession } from "next-auth/react";
import { DEFAULT_ROUTE } from "@/enums/defaultRoute.enums";
import { getSessions } from "@/services/sessions.service";
import RejoinAlert from "@/components/ui/toasts/RejoinAlert";
import { useSocket } from "@/store/socket/useSocket";
import { NOTIFICATION_TYPE } from "@/enums/messageTypes";
import { QueryKeyString } from "@/enums/queryKey.enums";
import { useQueryClient } from "react-query";
import { useRouter } from "next/router";
import useGetUserInfo from "@/hooks/profile/useGetUserInfo";

interface Props {
  children: ReactNode;
  contentHeightFixed?: boolean;
}
const queryRequestParams = {
  sort: "createdAt:desc",
  limit: 5,
  page: 1,
};

const UserLayout = ({ children, contentHeightFixed }: Props) => {
  // ** Hooks
  const { settings, saveSettings } = useSettings();
  const [dashBoardPath, setDashBoardPath] = useState(DEFAULT_ROUTE["user"]);
  const [rejoinSessionId, setRejoinSessionId] = useState<string>("");
  const [showReJoinAlert, setShowReJoinAlert] = useState<boolean>(false);
  const { socket } = useSocket();
  const queryClient = useQueryClient();
  const { pathname, push } = useRouter();
  const { refetch } = useGetUserInfo();

  useEffect(() => {
    const paramData = {
      sessionStatus: "in-session",
    };
    getSessions(paramData)
      .then((res) => {
        const data = res?.docs[0];
        if (data) {
          const { _id, sessionStatus } = data;
          if (sessionStatus === "in-session") {
            setRejoinSessionId(_id);
            setShowReJoinAlert(true);
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on(NOTIFICATION_TYPE.SESSION_ENDED, () => {
        queryClient.invalidateQueries([QueryKeyString.USER_QUERIES_DATA, queryRequestParams]);
        toast.error("Session Ended");
        setRejoinSessionId("");
        setShowReJoinAlert(false);
        if (pathname.includes("session")) {
          push(dashBoardPath);
        }
      });

      socket.on(NOTIFICATION_TYPE.USER_TOP_UP_SUCCESS, () => {
        refetch();
      });
    }

    return () => {
      socket?.off(NOTIFICATION_TYPE.SESSION_ENDED);
      socket?.off(NOTIFICATION_TYPE.USER_TOP_UP_SUCCESS);
    };
  }, [socket, dashBoardPath, pathname, push, queryClient]);

  useEffect(() => {
    // Log all socket events
    if (socket) {
      socket.onAny((event) => {
        if (event == "session-ended") {
          queryClient.invalidateQueries([QueryKeyString.USER_QUERIES_DATA, queryRequestParams]);
          toast.error("Session Ended");
          setRejoinSessionId("");
          setShowReJoinAlert(false);
          if (pathname.includes("session")) {
            push(dashBoardPath);
          }
        }
      });
    }

    // Clean up the event listener
    return () => {
      if (socket) {
        socket.offAny();
      }
    };
  }, [dashBoardPath]);

  // ** Vars for server side navigation
  // const { menuItems: verticalMenuItems } = ServerSideVerticalNavItems()
  // const { menuItems: horizontalMenuItems } = ServerSideHorizontalNavItems()

  /**
   *  The below variable will hide the current layout menu at given screen size.
   *  The menu will be accessible from the Hamburger icon only (Vertical Overlay Menu).
   *  You can change the screen size from which you want to hide the current layout menu.
   *  Please refer useMediaQuery() hook: https://mui.com/material-ui/react-use-media-query/,
   *  to know more about what values can be passed to this hook.
   *  ! Do not change this value unless you know what you are doing. It can break the template.
   */
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down("lg"));
  const { data: session } = useSession();
  useEffect(() => {
    if (session && session.user) return setDashBoardPath(DEFAULT_ROUTE[session.user.role]);
  }, [session]);

  if (hidden && settings.layout === "horizontal") {
    settings.layout = "vertical";
  }

  return (
    <Layout
      hidden={hidden}
      settings={settings}
      saveSettings={saveSettings}
      contentHeightFixed={contentHeightFixed}
      verticalLayoutProps={{
        navMenu: {
          navItems: VerticalNavItems(dashBoardPath),

          // Uncomment the below line when using server-side menu in vertical layout and comment the above line
          // navItems: verticalMenuItems
        },
        appBar: {
          content: (props) => (
            <VerticalAppBarContent
              hidden={hidden}
              settings={settings}
              saveSettings={saveSettings}
              toggleNavVisibility={props.toggleNavVisibility}
            />
          ),
        },
      }}
      {...(settings.layout === "horizontal" && {
        horizontalLayoutProps: {
          navMenu: {
            navItems: HorizontalNavItems(dashBoardPath),

            // Uncomment the below line when using server-side menu in horizontal layout and comment the above line
            // navItems: horizontalMenuItems
          },
          appBar: {
            content: () => <HorizontalAppBarContent settings={settings} saveSettings={saveSettings} />,
          },
        },
      })}
    >
      {showReJoinAlert ? <RejoinAlert rejoinSessionId={rejoinSessionId} setShowReJoinAlert={setShowReJoinAlert} /> : null}
      {children}
    </Layout>
  );
};

export default UserLayout;
