// ** React Imports
import { ReactNode } from "react";

// ** Next Import
import Link from "next/link";

// ** MUI Components
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Box, { BoxProps } from "@mui/material/Box";

// ** Layout Import
import BlankLayout from "src/@core/layouts/BlankLayout";

// ** Demo Imports
import FooterIllustrations from "src/views/pages/misc/FooterIllustrations";
import { DEFAULT_ROUTE } from "@/enums/defaultRoute.enums";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

// ** Styled Components
const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    width: "90vw",
  },
}));

const Img = styled("img")(({ theme }) => ({
  marginTop: theme.spacing(15),
  marginBottom: theme.spacing(15),
  [theme.breakpoints.down("lg")]: {
    height: 450,
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(10),
  },
  [theme.breakpoints.down("md")]: {
    height: 400,
  },
}));

const SessionEnded = ({ dashboardRoute }: { dashboardRoute: string }) => {
  return (
    <Box className="content-center">
      <Box
        sx={{
          p: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <BoxWrapper>
          <Typography variant="h1" sx={{ mb: 2.5 }}>
            Ended
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 2.5,
              letterSpacing: "0.18px",
              fontSize: "1.5rem !important",
            }}
          >
            Session Ended ⚠️
          </Typography>
          <Typography variant="body2">The session that you are trying to join has already been ended.</Typography>
        </BoxWrapper>
        <Img alt="error-illustration" src="/images/pages/404.png" />
        <Button
          href={dashboardRoute ? dashboardRoute : "https://24hrtherapy.co.uk"}
          component={Link}
          variant="contained"
          sx={{ px: 5.5 }}
        >
          Back to {dashboardRoute ? "Dashboard" : "Home"}
        </Button>
      </Box>
      <FooterIllustrations image="/images/pages/misc-401-object.png" />
    </Box>
  );
};

SessionEnded.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;
SessionEnded.authGuard = false;

export default SessionEnded;
export async function getServerSideProps(context: any) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session || !session.user) {
    return { props: {} };
  }
  if (session && session.user) {
    return { props: { dashboardRoute: DEFAULT_ROUTE[session.user.role] } };
  }

  return { props: {} };
}
