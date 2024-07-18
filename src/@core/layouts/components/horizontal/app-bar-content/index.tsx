// ** Next Import
import Link from "next/link";

// ** MUI Imports
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

// ** Type Import
import { LayoutProps } from "src/@core/layouts/types";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { IMAGES } from "@/assets";
import Image from "next/image";
import { Button } from "@mui/material";
import Popover from "@mui/material/Popover";
import { useState } from "react";

import {
  FacebookIcon,
  WhatsappIcon,
  XIcon,
  FacebookShareButton,
  WhatsappShareButton,
  TwitterShareButton,
} from "react-share";
import { IAccountDetails } from "@/types/interfaces/profile.interface";
import { useSession } from "next-auth/react";
import { ROLE } from "@/enums/role.enums";
import toast from "react-hot-toast";

interface Props {
  hidden: LayoutProps["hidden"];
  settings: LayoutProps["settings"];
  saveSettings: LayoutProps["saveSettings"];
  appBarContent: NonNullable<NonNullable<LayoutProps["horizontalLayoutProps"]>["appBar"]>["content"];
  appBarBranding: NonNullable<NonNullable<LayoutProps["horizontalLayoutProps"]>["appBar"]>["branding"];
  user: IAccountDetails | null;
}

const StyledLink = styled(Link)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
  marginRight: theme.spacing(8),
}));

const AppBarContent = (props: Props) => {
  // ** Props
  const { appBarContent: userAppBarContent, appBarBranding: userAppBarBranding } = props;
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { data } = useSession();
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const url = `https://www.24hrtherapy.co.uk/auth/register?refercode=${props.user?.referralCode}`;

  const base = props.user?.referralCode;
  const links: string | undefined = base;
  const copylink = () => {
    navigator.clipboard.writeText(links ? links : "");
    toast.success("copy successfully");
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {userAppBarBranding ? (
        userAppBarBranding(props)
      ) : (
        <StyledLink href="https://24hrtherapy.co.uk">
          <Typography variant="h6" sx={{ ml: 2, fontWeight: 700, lineHeight: 1.2 }}>
            <Image
              src={IMAGES.Logo}
              alt="24hrtherapy"
              width={98}
              height={24}
              style={{ maxWidth: "100%", height: "auto", width: "auto" }}
            />
          </Typography>
        </StyledLink>
      )}
      <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "end" }}>
        {data?.user.role !== ROLE.ADMIN && (
          <div>
            <Button aria-describedby={id} sx={{ alignItems: "end" }} onClick={handleOpen}>
              Refer a friend?
            </Button>
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
                  <span onClick={copylink} style={{ marginLeft: "4px" }}>
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
        )}
        {userAppBarContent ? userAppBarContent(props) : null}
      </Box>
    </Box>
  );
};

export default AppBarContent;
