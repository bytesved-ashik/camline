// ** MUI Imports
import Fab from "@mui/material/Fab";
import AppBar from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";
import Box, { BoxProps } from "@mui/material/Box";
import MuiToolbar, { ToolbarProps } from "@mui/material/Toolbar";

// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** Theme Config Import
import themeConfig from "src/configs/themeConfig";

// ** Type Import
import { LayoutProps } from "src/@core/layouts/types";

// ** Components
import Customizer from "src/@core/components/customizer";
import Footer from "./components/shared-components/footer";
import Navigation from "./components/horizontal/navigation";
import ScrollToTop from "src/@core/components/scroll-to-top";
import AppBarContent from "./components/horizontal/app-bar-content";

// ** Util Import
import { hexToRGBA } from "src/@core/utils/hex-to-rgba";
import { ROLE } from "@/enums/role.enums";
import { Button, Typography } from "@mui/material";
import { REQUEST_STATUS } from "@/enums/requestStatus.enums";
import { createRequest } from "@/services/session.service";
import toast from "react-hot-toast";
import useGetUserInfo from "@/hooks/profile/useGetUserInfo";
import useWalletUtility from "@/hooks/wallet/useWalletUtility";
import TopUpWallet from "@/components/ui/dialogs/TopUpWallet";
import { publishEvt, subscribeEvt } from "@/utils/events";
import useClearRequest from "@/hooks/request/useClearRequest";
import ClearRequest from "@/components/ui/dialogs/ClearRequest";
import { useEffect, useState } from "react";
import { CheckTopup } from "@/services/wallet.service";
import { useSession } from "next-auth/react";
import TherapistMedia from "@/components/ui/dialogs/TherapistMedia";
import { useRouter } from "next/router";

const HorizontalLayoutWrapper = styled("div")({
  height: "100%",
  display: "flex",
  ...(themeConfig.horizontalMenuAnimation && { overflow: "clip" }),
});

const MainContentWrapper = styled(Box)<BoxProps>({
  flexGrow: 1,
  minWidth: 0,
  display: "flex",
  minHeight: "100vh",
  flexDirection: "column",
});

const Toolbar = styled(MuiToolbar)<ToolbarProps>(({ theme }) => ({
  width: "100%",
  padding: `${theme.spacing(0, 6)} !important`,
  [theme.breakpoints.down("sm")]: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(4),
  },
  [theme.breakpoints.down("xs")]: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

const ContentWrapper = styled("main")(({ theme }) => ({
  flexGrow: 1,
  width: "100%",
  padding: theme.spacing(6),
  transition: "padding .25s ease-in-out",
  [theme.breakpoints.down("sm")]: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
}));

const HorizontalLayout = (props: LayoutProps) => {
  // const { data: users } = useSession();
  const { data: users } = useGetUserInfo();
  const { data } = useSession();

  const router = useRouter();
  const [openMedia, setOpenMedia] = useState(false);

  // handle Topup modal
  const { setShowTopUpModal, showTopUpModal, setIsTouupDone } = useWalletUtility();
  const { setShowClearRequest, showClearRequest } = useClearRequest();

  // ** Props
  const { hidden, children, settings, scrollToTop, footerProps, saveSettings, contentHeightFixed, horizontalLayoutProps } =
    props;

  // ** Vars
  const { skin, appBar, navHidden, appBarBlur, contentWidth } = settings;
  const appBarProps = horizontalLayoutProps?.appBar?.componentProps;
  const userNavMenuContent = horizontalLayoutProps?.navMenu?.content;

  let userAppBarStyle = {};
  if (appBarProps && appBarProps.sx) {
    userAppBarStyle = appBarProps.sx;
  }
  const userAppBarProps = Object.assign({}, appBarProps);
  delete userAppBarProps.sx;

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
        publishEvt("queryCreated");
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
    if (data?.user.role === ROLE.USER) {
      CheckTopup().then((data: any) => {
        if (data.checkTopUpResult) {
          publishEvt("touupSuccess");
          setIsTouupDone(true);
        } else {
          setIsTouupDone(false);

          // setShowTopUpModal(true);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (router.pathname.includes("user-account")) {
      setOpenMedia(false);
    } else {
      setOpenMedia(users && users[0].medias ? users[0]?.medias?.length === 0 : false);
    }
  }, [users, router]);

  return (
    <HorizontalLayoutWrapper className="layout-wrapper">
      <MainContentWrapper className="layout-content-wrapper" sx={{ ...(contentHeightFixed && { maxHeight: "100vh" }) }}>
        <AppBar
          color="default"
          elevation={skin === "bordered" ? 0 : 3}
          className="layout-navbar-and-nav-container"
          position={appBar === "fixed" ? "sticky" : "static"}
          sx={{
            alignItems: "center",
            color: "text.primary",
            justifyContent: "center",
            backgroundColor: "background.paper",
            ...(appBar === "static" && { zIndex: 13 }),
            ...(skin === "bordered" && {
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            }),
            transition: "border-bottom 0.2s ease-in-out, backdrop-filter .25s ease-in-out, box-shadow .25s ease-in-out",
            ...(appBar === "fixed"
              ? appBarBlur && {
                  backdropFilter: "blur(8px)",
                  backgroundColor: (theme) => hexToRGBA(theme.palette.background.paper, 0.9),
                }
              : {}),
            ...userAppBarStyle,
          }}
          {...userAppBarProps}
        >
          {/* Navbar / AppBar */}
          <Box
            className="layout-navbar"
            sx={{
              width: "100%",
              ...(navHidden
                ? {}
                : {
                    borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                  }),
            }}
          >
            <Toolbar
              className="navbar-content-container"
              sx={{
                mx: "auto",
                ...(contentWidth === "boxed" && {
                  "@media (min-width:1440px)": { maxWidth: "100%" },
                }),
                minHeight: (theme) => `${(theme.mixins.toolbar.minHeight as number) - 1}px !important`,
              }}
            >
              <AppBarContent
                {...props}
                hidden={hidden}
                settings={settings}
                saveSettings={saveSettings}
                appBarContent={horizontalLayoutProps?.appBar?.content}
                appBarBranding={horizontalLayoutProps?.appBar?.branding}
                user={users ? users[0] : null}
              />
            </Toolbar>
          </Box>

          {/* Navigation Menu */}
          {navHidden ? null : (
            <Box
              className="layout-horizontal-nav"
              sx={{
                width: "100%",
                ...horizontalLayoutProps?.navMenu?.sx,
                display: "flex",
              }}
            >
              <Toolbar
                className="horizontal-nav-content-container"
                sx={{
                  mx: "auto",
                  ...(contentWidth === "boxed" && {
                    "@media (min-width:1440px)": { maxWidth: "100%" },
                  }),
                  minHeight: (theme) =>
                    `${(theme.mixins.toolbar.minHeight as number) - (skin === "bordered" ? 1 : 0)}px !important`,
                }}
              >
                {(userNavMenuContent && userNavMenuContent(props)) || (
                  <Navigation
                    {...props}
                    horizontalNavItems={
                      (horizontalLayoutProps as NonNullable<LayoutProps["horizontalLayoutProps"]>).navMenu?.navItems
                    }
                  />
                )}
              </Toolbar>
              {users && users[0].roles.length > 0 && users[0].roles[0] === ROLE.USER && (
                <Box
                  className="layout-horizontal-nav"
                  sx={{
                    width: "40%",
                    ...horizontalLayoutProps?.navMenu?.sx,
                    display: "flex",
                  }}
                >
                  <Button variant="contained" sx={{ width: 180, marginTop: 10, marginBottom: 10 }} onClick={quickConnect}>
                    Quick connect
                  </Button>
                  <Typography
                    sx={{
                      width: 200,
                      margin: 5,
                      alignItems: "center",
                      display: "flex",
                      textAlign: "center",
                    }}
                  >
                    Available Amount / Minutes
                    <br />{" "}
                    {users && users[0].wallet.mainBalance > 0
                      ? `£ ${users[0].wallet.mainBalance.toFixed(2)} / ${users[0].paidMinutes.toFixed(2)}`
                      : "£ 0.00 / 0.00"}
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      width: 120,
                      marginTop: 10,
                      marginBottom: 10,
                      mr: 5,
                    }}
                    onClick={() => setShowTopUpModal(true)}
                  >
                    Top up
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </AppBar>

        {/* Content */}
        <ContentWrapper
          className="layout-page-content"
          sx={{
            ...(contentHeightFixed && { display: "flex", overflow: "hidden" }),
            ...(contentWidth === "boxed" && {
              mx: "auto",
              "@media (min-width:1440px)": { maxWidth: "100%" },
              "@media (min-width:1200px)": { maxWidth: "100%" },
            }),
          }}
        >
          {children}
        </ContentWrapper>

        {/* Footer */}
        <Footer {...props} footerStyles={footerProps?.sx} footerContent={footerProps?.content} />

        {/* Customizer */}
        {themeConfig.disableCustomizer || hidden ? null : <Customizer />}

        {/* Scroll to top button */}
        {scrollToTop ? (
          scrollToTop(props)
        ) : (
          <ScrollToTop className="mui-fixed">
            <Fab color="primary" size="small" aria-label="scroll back to top">
              <Icon icon="mdi:arrow-up" />
            </Fab>
          </ScrollToTop>
        )}
      </MainContentWrapper>
      <TopUpWallet
        closeDialog={() => {
          setShowTopUpModal(false);
        }}
        showDialog={showTopUpModal}
      />
      {(users && users[0]?.roles[0] === ROLE.USER) || !router.pathname.includes("/user-account/") ? (
        <TherapistMedia showDialog={openMedia} onClose={() => setOpenMedia(false)} />
      ) : (
        ""
      )}

      <ClearRequest
        closeDialog={() => {
          setShowClearRequest(false);
        }}
        showDialog={showClearRequest}
        clearRequest={quickConnect}
      />
    </HorizontalLayoutWrapper>
  );
};

export default HorizontalLayout;
