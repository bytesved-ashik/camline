import { ReactNode, useEffect } from "react";
import BlankLayout from "src/@core/layouts/BlankLayout";
import { DEFAULT_ROUTE } from "@/enums/defaultRoute.enums";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/router";

const LandingPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("https://24hrtherapy.co.uk");
  }, []);

  return (
    <div
      style={{
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Box sx={{ display: "flex" }}>
        <CircularProgress />
      </Box>
    </div>
  );
};

LandingPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;

LandingPage.authGuard = false;
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

export default LandingPage;
