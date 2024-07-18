// ** React Import
import { useEffect, useRef, useState } from "react";

// ** MUI Import
import List from "@mui/material/List";
import Box, { BoxProps } from "@mui/material/Box";
import { styled, useTheme } from "@mui/material/styles";

// ** Third Party Components
import PerfectScrollbar from "react-perfect-scrollbar";

// ** Type Import
import { LayoutProps } from "src/@core/layouts/types";

import themeConfig from "src/configs/themeConfig";

// ** Component Imports
import Drawer from "./Drawer";
import VerticalNavItems from "./VerticalNavItems";
import VerticalNavHeader from "./VerticalNavHeader";

// ** Util Import
import { hexToRGBA } from "src/@core/utils/hex-to-rgba";
import { Button, Popover, Typography } from "@mui/material";
import useGetUserInfo from "@/hooks/profile/useGetUserInfo";
import useWalletUtility from "@/hooks/wallet/useWalletUtility";
import { ROLE } from "@/enums/role.enums";
import { REQUEST_STATUS } from "@/enums/requestStatus.enums";
import { createRequest } from "@/services/session.service";
import toast from "react-hot-toast";
import {
  FacebookIcon,
  FacebookShareButton,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
  XIcon,
} from "react-share";
import ClearRequest from "@/components/ui/dialogs/ClearRequest";
import useClearRequest from "@/hooks/request/useClearRequest";
import { subscribeEvt } from "@/utils/events";
import TherapistMedia from "@/components/ui/dialogs/TherapistMedia";
import { useRouter } from "next/router";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import TopUpWallet from "@/components/ui/dialogs/TopUpWallet";

interface Props {
  navWidth: number;
  navVisible: boolean;
  collapsedNavWidth: number;
  hidden: LayoutProps["hidden"];
  navigationBorderWidth: number;
  toggleNavVisibility: () => void;
  settings: LayoutProps["settings"];
  children: LayoutProps["children"];
  setNavVisible: (value: boolean) => void;
  saveSettings: LayoutProps["saveSettings"];
  navMenuContent: LayoutProps["verticalLayoutProps"]["navMenu"]["content"];
  navMenuBranding: LayoutProps["verticalLayoutProps"]["navMenu"]["branding"];
  menuLockedIcon: LayoutProps["verticalLayoutProps"]["navMenu"]["lockedIcon"];
  verticalNavItems: LayoutProps["verticalLayoutProps"]["navMenu"]["navItems"];
  navMenuProps: LayoutProps["verticalLayoutProps"]["navMenu"]["componentProps"];
  menuUnlockedIcon: LayoutProps["verticalLayoutProps"]["navMenu"]["unlockedIcon"];
  afterNavMenuContent: LayoutProps["verticalLayoutProps"]["navMenu"]["afterContent"];
  beforeNavMenuContent: LayoutProps["verticalLayoutProps"]["navMenu"]["beforeContent"];
}

const StyledBoxForShadow = styled(Box)<BoxProps>(({ theme }) => ({
  top: 60,
  left: -8,
  zIndex: 2,
  opacity: 0,
  position: "absolute",
  pointerEvents: "none",
  width: "calc(100% + 15px)",
  height: theme.mixins.toolbar.minHeight,
  transition: "opacity .15s ease-in-out",
  "&.scrolled": {
    opacity: 1,
  },
}));

const Navigation = (props: Props) => {
  const { data: users } = useGetUserInfo();
  const router = useRouter();
  const [openMedia, setOpenMedia] = useState(false);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const url = `https://www.24hrtherapy.co.uk/auth/register?refercode=${users ? users[0].referralCode : ""}`;

  // handle Topup modal
  const { setShowTopUpModal, setIsTouupDone, showTopUpModal } = useWalletUtility();
  const { setShowClearRequest, showClearRequest } = useClearRequest();

  // ** Props
  const { hidden, settings, afterNavMenuContent, beforeNavMenuContent, navMenuContent: userNavMenuContent } = props;

  // ** States
  const [navHover, setNavHover] = useState<boolean>(false);
  const [groupActive, setGroupActive] = useState<string[]>([]);
  const [currentActiveGroup, setCurrentActiveGroup] = useState<string[]>([]);

  // ** Ref
  const shadowRef = useRef(null);

  // ** Hooks
  const theme = useTheme();
  const { mode } = settings;

  // ** Var
  const { afterVerticalNavMenuContentPosition, beforeVerticalNavMenuContentPosition } = themeConfig;

  // ** Fixes Navigation InfiniteScroll
  const handleInfiniteScroll = (ref: HTMLElement) => {
    if (ref) {
      /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
      /* @ts-ignore */
      ref._getBoundingClientRect = ref.getBoundingClientRect;

      ref.getBoundingClientRect = () => {
        /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
        /* @ts-ignore */
        const original = ref._getBoundingClientRect();

        return { ...original, height: Math.floor(original.height) };
      };
    }
  };

  // ** Scroll Menu
  const scrollMenu = (container: any) => {
    if (beforeVerticalNavMenuContentPosition === "static" || !beforeNavMenuContent) {
      container = hidden ? container.target : container;
      if (shadowRef && container.scrollTop > 0) {
        /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
        /* @ts-ignore */
        if (!shadowRef.current.classList.contains("scrolled")) {
          /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
          /* @ts-ignore */
          shadowRef.current.classList.add("scrolled");
        }
      } else {
        /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
        /* @ts-ignore */
        shadowRef.current.classList.remove("scrolled");
      }
    }
  };

  const shadowBgColor = () => {
    if (mode === "light") {
      return `linear-gradient(${theme.palette.customColors.lightBg} 5%,${hexToRGBA(
        theme.palette.customColors.lightBg,
        0.85
      )} 30%,${hexToRGBA(theme.palette.customColors.lightBg, 0.5)} 65%,${hexToRGBA(
        theme.palette.customColors.lightBg,
        0.3
      )} 75%,transparent)`;
    } else {
      return `linear-gradient(${theme.palette.customColors.darkBg} 5%,${hexToRGBA(
        theme.palette.customColors.darkBg,
        0.85
      )} 30%,${hexToRGBA(theme.palette.customColors.darkBg, 0.5)} 65%,${hexToRGBA(
        theme.palette.customColors.darkBg,
        0.3
      )} 75%,transparent)`;
    }
  };

  const ScrollWrapper = hidden ? Box : PerfectScrollbar;

  useEffect(() => {
    subscribeEvt("touupSuccess", () => {
      setIsTouupDone(true);
    });
  }, []);

  const quickConnect = async () => {
    const query = "Need urgent help";
    const createQueryData = {
      requestType: "private",
      requestStatus: REQUEST_STATUS.IN_POOL,
      categories: (users && users[0].profile.categories) ?? ["642fcaa6ddc2d5e4bd5adb8b"],
      query,
      minBudget: 1,
      maxBudget: 1,
    };
    await createRequest(createQueryData)
      .then(() => {
        toast.success("Requested created. Please wait for therapist to accept it.");
        setShowClearRequest(false);
      })
      .catch((err: any) => {
        if (err.response.data.message === "You already have a request in pool. Please wait for it to expire or cancel it.") {
          setShowClearRequest(true);

          return;
        }
        if (
          err?.response?.data?.message === "Don't have a top-up transaction" ||
          err?.response?.data?.message === "Insufficient funds"
        ) {
          toast.error("You don't have enough balance to create a query");
          setShowTopUpModal(true);

          return;
        }
        toast.error(err.response.data.message ?? "Something went wrong. please try again latter.");
      });
  };

  useEffect(() => {
    if (router.pathname.includes("user-account")) {
      setOpenMedia(false);
    } else {
      setOpenMedia(users && users[0].medias ? users[0]?.medias?.length === 0 : false);
    }
  }, [users, router]);

  const base = users ? users[0].referralCode : "";
  const links: string | undefined = base;
  const copylink = () => {
    navigator.clipboard.writeText(links ? links : "");
    toast.success("copy successfully");
  };

  return (
    <Drawer {...props} navHover={navHover} setNavHover={setNavHover}>
      <VerticalNavHeader {...props} navHover={navHover} />
      {beforeNavMenuContent && beforeVerticalNavMenuContentPosition === "fixed" ? beforeNavMenuContent(props) : null}
      {(beforeVerticalNavMenuContentPosition === "static" || !beforeNavMenuContent) && (
        <StyledBoxForShadow ref={shadowRef} sx={{ background: shadowBgColor() }} />
      )}
      <Box sx={{ position: "relative", overflow: "hidden" }}>
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <ScrollWrapper
          {...(hidden
            ? {
                onScroll: (container: any) => scrollMenu(container),
                sx: { height: "100%", overflowY: "auto", overflowX: "hidden" },
              }
            : {
                options: { wheelPropagation: false },
                onScrollY: (container: any) => scrollMenu(container),
                containerRef: (ref: any) => handleInfiniteScroll(ref),
              })}
        >
          {beforeNavMenuContent && beforeVerticalNavMenuContentPosition === "static" ? beforeNavMenuContent(props) : null}
          {userNavMenuContent ? (
            userNavMenuContent(props)
          ) : (
            <List className="nav-items" sx={{ pt: 0, "& > :first-child": { mt: "0" } }}>
              <VerticalNavItems
                navHover={navHover}
                groupActive={groupActive}
                setGroupActive={setGroupActive}
                currentActiveGroup={currentActiveGroup}
                setCurrentActiveGroup={setCurrentActiveGroup}
                {...props}
              />
            </List>
          )}
          {afterNavMenuContent && afterVerticalNavMenuContentPosition === "static" ? afterNavMenuContent(props) : null}
        </ScrollWrapper>
      </Box>
      {afterNavMenuContent && afterVerticalNavMenuContentPosition === "fixed" ? afterNavMenuContent(props) : null}
      {users && users[0].roles[0] !== ROLE.ADMIN && (
        <>
          <Button aria-describedby={id} variant="contained" sx={{ margin: 2 }} onClick={handleOpen}>
            Refer a friend?
          </Button>
          <div>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              <Box sx={{ p: 5 }}>
                <Typography sx={{ p: 2 }}>
                  <span onClick={copylink} style={{ marginLeft: "7px" }}>
                    <ContentCopyIcon sx={{ fontSize: "35px" }} />
                  </span>
                </Typography>
                <Typography sx={{ p: 2 }}>
                  <FacebookShareButton url={url}>
                    <FacebookIcon size={42} round={true} />
                  </FacebookShareButton>
                </Typography>
                <Typography sx={{ p: 2 }}>
                  <WhatsappShareButton url={url}>
                    <WhatsappIcon size={42} round={true} />
                  </WhatsappShareButton>
                </Typography>
                <Typography sx={{ p: 2 }}>
                  <TwitterShareButton url={url}>
                    <XIcon size={42} round={true} />
                  </TwitterShareButton>
                </Typography>
              </Box>
            </Popover>
          </div>
        </>
      )}
      {users && users[0].roles.length > 0 && users[0].roles[0] === ROLE.USER && (
        <>
          <Button variant="contained" sx={{ margin: 2 }} onClick={() => setShowTopUpModal(true)}>
            Top up
          </Button>

          <Button variant="contained" sx={{ margin: 2 }} onClick={quickConnect}>
            Quick connect
          </Button>
          <Typography
            sx={{
              alignItems: "center",
              display: "flex",
              textAlign: "center",
              justifyContent: "center",
            }}
          >
            Wallet Balance
          </Typography>
          <Typography
            sx={{
              width: 300,
              margin: 5,
              alignItems: "center",
              display: "flex",
              textAlign: "center",
            }}
          >
            Amount: £ {users && users[0].wallet.mainBalance.toFixed(2)}
            <br />
            Minutes:{users && users[0].paidMinutes.toFixed(2)}
          </Typography>
        </>
      )}

      <TherapistMedia showDialog={openMedia} onClose={() => setOpenMedia(false)} />

      <ClearRequest
        closeDialog={() => {
          setShowClearRequest(false);
        }}
        showDialog={showClearRequest}
        clearRequest={quickConnect}
      />
      <TopUpWallet
        closeDialog={() => {
          setShowTopUpModal(false);
        }}
        showDialog={showTopUpModal}
      />
    </Drawer>
  );
};

export default Navigation;
