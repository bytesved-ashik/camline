// ** React Imports
import { useState, SyntheticEvent, Fragment } from "react";

// ** Next Import
import { useRouter } from "next/router";

// ** MUI Imports
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** Type Imports
import { Settings } from "src/@core/context/settingsContext";

// ** Hooks
import { signOut, useSession } from "next-auth/react";
import { useAccountDetails } from "@/hooks/profile/useAccountDetails";
import { useSettings } from "@/@core/hooks/useSettings";
import { ROLE } from "@/enums/role.enums";
import { eraseCookie } from "@/@core/utils/cookie-handler";

interface Props {
  settings: Settings;
}

// ** Styled Components
const BadgeContentSpan = styled("span")(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: "50%",
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
}));

export default function UserDropdown({ settings }: Props) {
  const { profilePic, imgSrc } = useAccountDetails();
  const { settings: modeSetting, saveSettings } = useSettings();
  const { data: session } = useSession();
  const userRole = localStorage.getItem("TCUSER"); //eslint-disable-line

  // ** States
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  // ** Hooks
  const router = useRouter();

  // ** Vars
  const { direction } = settings;

  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = (url?: string) => {
    if (url) {
      router.push(url);
    }
    setAnchorEl(null);
  };

  const styles = {
    py: 2,
    px: 4,
    width: "100%",
    display: "flex",
    alignItems: "center",
    color: "text.primary",
    textDecoration: "none",
    "& svg": {
      mr: 2,
      fontSize: "1.375rem",
      color: "text.primary",
    },
  };
  const dropDownTitles = [
    {
      icon: "mdi:account-outline",
      title: "Profile",
      url: "/user-account",
    },

    // {
    //   icon: "mdi:email-outline",
    //   title: "Inbox",
    //   url: "/apps/email/inbox",
    //   disabled: true,
    // },
    // {
    //   icon: "mdi:message-outline",
    //   title: "Chat",
    //   url: "chat/messages",
    //   divider: true,
    //   disabled: true,
    // },

    {
      icon: "mdi:lock-reset",
      title: "Change Password",
      url: "/change-password",
    },

    // {
    //   icon: "mdi:cog-outline",
    //   title: "Settings",
    //   url: "profile/settings",
    //   disabled: true,
    // },
    // {
    //   icon: "mdi:currency-gbp",
    //   title: "Pricing",
    //   url: "/pricing",
    //   disabled: true,
    // },
    // {
    //   icon: "mdi:deskphone",
    //   title: "Call History",
    //   url: "/call-history",
    //   disabled: false,
    // },
    // {
    //   icon: "mdi:currency-gbp",
    //   title: "Transactions",
    //   url: "/transactions",
    //   disabled: false,
    // },

    {
      icon: "mdi:help-circle-outline",
      title: "FAQ",
      url:
        userRole == "therapist"
          ? "https://24hrtherapy.co.uk/information-for-therapists"
          : "https://www.24hrtherapy.co.uk/frequently-asked-questions",
      divider: true,
    },
  ];

  return (
    <Fragment>
      <Badge
        overlap="circular"
        onClick={handleDropdownOpen}
        sx={{ ml: 2, cursor: "pointer", borderRadius: "50%" }}
        badgeContent={<BadgeContentSpan />}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Avatar
          alt="profile pic"
          onClick={handleDropdownOpen}
          sx={{ width: 40, height: 40 }}
          src={session?.user.role === ROLE.ADMIN ? imgSrc : profilePic ? profilePic : imgSrc}
        />
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ "& .MuiMenu-paper": { width: 230, mt: 4 } }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: direction === "ltr" ? "right" : "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: direction === "ltr" ? "right" : "left",
        }}
      >
        <Box sx={{ pt: 2, pb: 3, px: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Badge
              overlap="circular"
              badgeContent={<BadgeContentSpan />}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              sx={{ borderRadius: "50%" }}
            >
              <Avatar
                alt="profile pic"
                src={session?.user.role === ROLE.ADMIN ? imgSrc : profilePic ? profilePic : imgSrc}
                sx={{ width: "2.5rem", height: "2.5rem" }}
              />
            </Badge>
            <Box
              sx={{
                display: "flex",
                ml: 3,
                alignItems: "flex-start",
                flexDirection: "column",
              }}
            >
              <Typography sx={{ fontWeight: 600 }}>
                {session?.user.firstName} {session?.user.lastName}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: "0.8rem", color: "text.disabled" }}>
                {session?.user.role}
              </Typography>
            </Box>
          </Box>
        </Box>

        {dropDownTitles.map((dropDown, index) => {
          return (
            <Fragment key={index}>
              <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose(dropDown.url)}>
                <Box sx={styles}>
                  <Icon icon={dropDown.icon} />
                  {dropDown.title}
                </Box>
              </MenuItem>
              {dropDown.divider && <Divider />}
            </Fragment>
          );
        })}
        <MenuItem
          onClick={() => {
            signOut({ callbackUrl: "/" });
            saveSettings({ ...modeSetting, mode: "light" });
            eraseCookie("isLogin");
          }}
          sx={{
            py: 2,
            "& svg": { mr: 2, fontSize: "1.375rem", color: "text.primary" },
          }}
        >
          <Icon icon="mdi:logout-variant" />
          Logout
        </MenuItem>
      </Menu>
    </Fragment>
  );
}
