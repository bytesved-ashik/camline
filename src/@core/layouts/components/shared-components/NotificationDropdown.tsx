// ** React Imports
import { Fragment, ReactNode, SyntheticEvent, useState } from "react";

// ** MUI Imports
import * as toast from "@/utils/toast";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MuiMenu, { MenuProps } from "@mui/material/Menu";
import MuiMenuItem, { MenuItemProps } from "@mui/material/MenuItem";
import { styled, Theme } from "@mui/material/styles";
import Typography, { TypographyProps } from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import moment from "moment";

// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** Third Party Components
import PerfectScrollbarComponent from "react-perfect-scrollbar";

// ** Type Imports
import { Settings } from "src/@core/context/settingsContext";
import { ThemeColor } from "src/@core/layouts/types";

// ** Custom Components Imports
import CustomChip from "src/@core/components/mui/chip";

// ** Util Import
import { rejectRequestById } from "@/services/session.service";
import { useSessionData } from "@/store/sessionData/useSessionData";
import { QueryAccepted } from "@/types/interfaces/queryAccepted.interface";
import { useRouter } from "next/router";

export type NotificationsType = {
  meta: string;
  title: string;
  subtitle: string;
} & (
  | {
      avatarAlt: string;
      avatarImg: string;
      avatarText?: never;
      avatarColor?: never;
      avatarIcon?: never;
    }
  | {
      avatarAlt?: never;
      avatarImg?: never;
      avatarText: string;
      avatarIcon?: never;
      avatarColor?: ThemeColor;
    }
  | {
      avatarAlt?: never;
      avatarImg?: never;
      avatarText?: never;
      avatarIcon: ReactNode;
      avatarColor?: ThemeColor;
    }
);
interface Props {
  settings: Settings;
  notifications: QueryAccepted[];
}

// ** Styled Menu component
const Menu = styled(MuiMenu)<MenuProps>(({ theme }) => ({
  "& .MuiMenu-paper": {
    width: 380,
    overflow: "hidden",
    marginTop: theme.spacing(4),
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  "& .MuiMenu-list": {
    padding: 0,
  },
}));

// ** Styled MenuItem component
const MenuItem = styled(MuiMenuItem)<MenuItemProps>(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  "&:not(:last-of-type)": {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}));

// ** Styled PerfectScrollbar component
const PerfectScrollbar = styled(PerfectScrollbarComponent)({
  maxHeight: 344,
});

// ** Styled Avatar component
// const Avatar = styled(CustomAvatar)<CustomAvatarProps>({
//   width: 38,
//   height: 38,
//   fontSize: "1.125rem",
// });

// ** Styled component for the title in MenuItems
const MenuItemTitle = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 600,
  flex: "1 1 100%",
  overflow: "hidden",
  fontSize: "0.875rem",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  marginBottom: theme.spacing(0.75),
}));

// ** Styled component for the subtitle in MenuItems
const MenuItemSubtitle = styled(Typography)<TypographyProps>({
  flex: "1 1 100%",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
});

const ScrollWrapper = ({ children, hidden }: { children: ReactNode; hidden: boolean }) => {
  if (hidden) {
    return <Box sx={{ maxHeight: 349, overflowY: "auto", overflowX: "hidden" }}>{children}</Box>;
  } else {
    return <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>{children}</PerfectScrollbar>;
  }
};

const NotificationDropdown = (props: Props) => {
  // ** Props
  const { settings, notifications } = props;

  // ** States
  const [anchorEl, setAnchorEl] = useState<(EventTarget & Element) | null>(null);

  // ** Hook
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down("lg"));
  const { setSessionId } = useSessionData();

  // ** Vars
  const { direction } = settings;
  const router = useRouter();

  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = () => {
    setAnchorEl(null);
  };

  const rejectRequestHandler = async (id: string) => {
    const data = await rejectRequestById(id);
    if (data) {
      toast.success("request rejected successfully");
    }
  };

  const acceptRequestHandler = async (sessionId: string) => {
    setSessionId(sessionId);
    router.push({
      pathname: `/session/${sessionId}`,
    });
  };

  return (
    <Fragment>
      <IconButton color="inherit" aria-haspopup="true" onClick={handleDropdownOpen} aria-controls="customized-menu">
        <Badge
          color="error"
          variant="dot"
          invisible={!notifications.length}
          sx={{
            "& .MuiBadge-badge": {
              top: 4,
              right: 4,
              boxShadow: (theme) => `0 0 0 2px ${theme.palette.background.paper}`,
            },
          }}
        >
          <Icon icon="mdi:bell-outline" />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleDropdownClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: direction === "ltr" ? "right" : "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: direction === "ltr" ? "right" : "left",
        }}
      >
        <MenuItem
          disableRipple
          disableTouchRipple
          sx={{
            cursor: "default",
            userSelect: "auto",
            backgroundColor: "transparent !important",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Typography sx={{ cursor: "text", fontWeight: 600 }}>Notifications</Typography>
            <CustomChip
              skin="light"
              size="small"
              color="primary"
              label={`${notifications.length} New`}
              sx={{
                height: 20,
                fontSize: "0.75rem",
                fontWeight: 500,
                borderRadius: "10px",
              }}
            />
          </Box>
        </MenuItem>
        <ScrollWrapper hidden={hidden}>
          {notifications.map((notification: QueryAccepted, index: number) => (
            <MenuItem key={index} onClick={handleDropdownClose}>
              <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    mx: 4,
                    flex: "1 1",
                    display: "flex",
                    overflow: "hidden",
                    flexDirection: "column",
                  }}
                >
                  <MenuItemTitle>{notification.acceptedBy.name}</MenuItemTitle>
                  <MenuItemSubtitle variant="body2">{notification.sessionStatus}</MenuItemSubtitle>
                  <Box sx={{ display: "flex", mt: 2 }}>
                    <Button
                      onClick={() => {
                        acceptRequestHandler(notification._id);
                      }}
                      color="primary"
                      variant="contained"
                    >
                      Accept
                    </Button>
                    <Button
                      onClick={() => {
                        rejectRequestHandler(notification._id);
                      }}
                      color="secondary"
                      variant="outlined"
                      sx={{ ml: 2 }}
                    >
                      Reject
                    </Button>
                  </Box>
                </Box>
                <Typography variant="caption" sx={{ color: "text.disabled" }}>
                  {moment(notification.updatedAt).calendar(null, {
                    sameDay: "[Today]",
                    lastDay: "[Yesterday]",
                    lastWeek: "DD MMM",
                    sameElse: "DD MMM",
                  })}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </ScrollWrapper>
        <MenuItem
          disableRipple
          disableTouchRipple
          sx={{
            py: 3.5,
            borderBottom: 0,
            cursor: "default",
            userSelect: "auto",
            backgroundColor: "transparent !important",
            borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <Button disabled={notifications.length === 0} fullWidth variant="contained" onClick={handleDropdownClose}>
            Read All Notifications
          </Button>
        </MenuItem>
      </Menu>
    </Fragment>
  );
};

export default NotificationDropdown;
