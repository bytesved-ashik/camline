import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu"; //eslint-disable-line
import { Button, Container, IconButton, Popover, Typography, useMediaQuery } from "@mui/material"; //eslint-disable-line
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Toolbar from "@mui/material/Toolbar";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import * as React from "react";
import { IMAGES } from "src/assets";
import { useSettings } from "@/@core/hooks/useSettings";
import { eraseCookie } from "@/@core/utils/cookie-handler";

type Anchor = "top" | "left" | "bottom" | "right";

// type INavLink = {
//   title: string;
//   url: string;
// };
// const NavLinks: INavLink[] = [
//   { title: "Process", url: "#process" },
//   { title: "Services", url: "#services" },
// ];
type NavbarProps = {
  dashboardRoute: string;
};

export default function Navbar({ dashboardRoute }: NavbarProps) {
  const { data: session } = useSession();
  const { settings, saveSettings } = useSettings();

  const [state, setState] = React.useState({
    left: false,
  });
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const route = useRouter();
  const [isHomeScreen, setIsHomeScreen] = React.useState(false);
  React.useEffect(() => {
    setIsHomeScreen(route.pathname === "/");
  }, [route.pathname]);
  const scrollToSection = (sectionId: string) => {
    if (!isHomeScreen) {
      route.push(`/${sectionId}`);

      return;
    }
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
      sectionElement.scrollIntoView();
    }
  };

  const toggleDrawer = (anchor: Anchor, open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  //eslint-disable-next-line
  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {dashboardRoute && (
          <>
            <ListItem disablePadding>
              <ListItemButton>
                <Link
                  href={dashboardRoute}
                  sx={{
                    fontWeight: 500,
                    fontSize: "15px",
                    cursor: "pointer",
                    textDecoration: "none",
                    textTransform: "uppercase",
                  }}
                >
                  Dashboard
                </Link>
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
      <Box sx={{ padding: "0 16px" }}>
        <Toolbar
          style={{
            padding: "0",
            minHeight: "0",
            flexDirection: "column",
          }}
        >
          {session && session.user ? (
            <>
              <ListItem disablePadding>
                <ListItemButton sx={{ p: 0 }} onClick={() => scrollToSection(dashboardRoute)}>
                  <Typography sx={{ textTransform: "uppercase", fontWeight: "500" }}>Logout</Typography>
                  <LogoutIcon
                    onClick={() => {
                      signOut({ callbackUrl: "/" });
                      saveSettings({ ...settings, mode: "light" });
                      eraseCookie("isLogin");
                    }}
                    sx={{
                      cursor: "pointer",
                      ml: 2,
                      ":hover": {
                        color: "#666CFF",
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </>
          ) : (
            <></>
          )}
        </Toolbar>
      </Box>
    </Box>
  );

  const isLargeScreen = useMediaQuery("(max-width:900px)");

  return (
    <Container
      style={{ padding: "0px" }}
      sx={{
        maxWidth: {
          xs: "xs",
          sm: "sm",
          md: "md",
          lg: "lg",
          xl: "1200px",
        },
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          maxWidth: "xl",
          margin: "0px",
          flexWrap: "wrap",
          px: "0px",
        }}
        style={{ width: "100%", paddingLeft: "0", paddingRight: "0" }}
      >
        <Link href="https://24hrtherapy.co.uk">
          <Image
            src={IMAGES.Logo}
            alt="24hrtherapy"
            width={98}
            height={34}
            style={{ maxWidth: "100%", height: "auto", width: "auto" }}
          />
        </Link>

        <Toolbar
          sx={{
            display: {
              md: "none",
              xs: "none",
            },
          }}
          style={{ paddingRight: "0", minHeight: "0" }}
        >
          <>
            <Button
              variant="outlined"
              sx={{
                color: "#354BC0",
                backgroundColor: "transparent",
                borderRadius: "0px",
                flex: "1",
                "&:hover": { bgcolor: "transparent", color: "#354BC0" },
                cursor: "pointer",
                padding: " 8.48px 10px",
                marginRight: "1rem",
                maxWidth: "100px",
              }}
              href="/auth/register"
            >
              Sign Up
            </Button>
            <Button
              variant="outlined"
              sx={{
                cursor: "pointer",
                padding: " 9.48px 20px",
                borderRadius: "0px",
              }}
              href="/auth/login"
            >
              Sign In
            </Button>
          </>
        </Toolbar>

        <Toolbar
          style={{
            padding: "0",
            minHeight: "0",
          }}
          sx={{
            display: {
              md: "flex",
              xs: "flex",
            },
          }}
        >
          {session && session.user ? (
            <>
              {dashboardRoute && (
                <>
                  <Link
                    href={dashboardRoute}
                    sx={{
                      fontWeight: 500,
                      fontSize: "15px",
                      cursor: "pointer",
                      textDecoration: "none",
                      padding: {
                        xl: "0 20px",
                        lg: "0 16px",
                        xs: "0 10px",
                        ":hover": {
                          textDecoration: "none",
                        },
                      },
                      textTransform: "uppercase",
                      ":hover": {
                        color: "#5a5fe0",
                      },
                    }}
                  >
                    Dashboard
                  </Link>
                </>
              )}
              <LogoutIcon
                onClick={() => {
                  signOut({ callbackUrl: "/" });
                }}
                sx={{
                  cursor: "pointer",
                  ml: 2,
                  ":hover": {
                    color: "#666CFF",
                  },
                }}
              />
            </>
          ) : (
            <>
              <div style={{ display: isLargeScreen ? "none" : "block" }}>
                <Button
                  variant="outlined"
                  sx={{
                    color: "#354BC0",
                    backgroundColor: "transparent",
                    borderRadius: "0px",
                    "&:hover": { bgcolor: "transparent", color: "#354BC0" },
                    cursor: "pointer",
                    padding: " 8.48px 10px",
                    marginRight: "1rem",
                  }}
                  href="https://www.24hrtherapy.co.uk/about"
                >
                  About US
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    color: "#354BC0",
                    backgroundColor: "transparent",
                    borderRadius: "0px",
                    flex: "1",
                    "&:hover": { bgcolor: "transparent", color: "#354BC0" },
                    cursor: "pointer",
                    padding: " 8.48px 10px",
                    marginRight: "1rem",
                  }}
                  href="https://www.24hrtherapy.co.uk/faqs"
                >
                  FAQs
                </Button>

                <Button
                  variant="outlined"
                  sx={{
                    color: "#354BC0",
                    backgroundColor: "transparent",
                    borderRadius: "0px",
                    "&:hover": { bgcolor: "transparent", color: "#354BC0" },
                    cursor: "pointer",
                    padding: " 8.48px 10px",
                    marginRight: "1rem",
                  }}
                  href="https://www.24hrtherapy.co.uk/contact"
                >
                  Contact us{" "}
                </Button>
              </div>
              <Button
                variant="outlined"
                sx={{
                  color: "#354BC0",
                  backgroundColor: "transparent",
                  borderRadius: "0px",
                  "&:hover": { bgcolor: "transparent", color: "#354BC0" },
                  cursor: "pointer",
                  padding: " 8.48px 10px",
                  marginRight: "1rem",
                }}
                href="/auth/register"
              >
                Sign Up
              </Button>
              <Button
                variant="outlined"
                sx={{
                  cursor: "pointer",
                  padding: " 9.48px 10px",
                  borderRadius: "0px",
                }}
                href="/auth/login"
              >
                Sign In
              </Button>
              <div style={{ display: isLargeScreen ? "block" : "none" }}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleClick}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
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
                  <Typography
                    sx={{ p: 2, cursor: "pointer" }}
                    onClick={() => route.push("https://www.24hrtherapy.co.uk/about")}
                  >
                    About Us
                  </Typography>
                  <Typography
                    sx={{ p: 2, cursor: "pointer" }}
                    onClick={() => route.push("https://www.24hrtherapy.co.uk/faqs")}
                  >
                    FAQs
                  </Typography>

                  <Typography
                    sx={{ p: 2, cursor: "pointer" }}
                    onClick={() => route.push("https://www.24hrtherapy.co.uk/contact")}
                  >
                    Contact us
                  </Typography>
                </Popover>
              </div>
            </>
          )}
        </Toolbar>
      </Toolbar>
    </Container>
  );
}
