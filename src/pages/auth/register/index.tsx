import FooterPoliciesSection from "src/components/common/footer/PoliciesSection";
import { Box, Container } from "@mui/material";
import Image from "next/image";
import CondensedNavbar from "src/components/common/navbar/CondensedNavbar";
import RegisterCards from "src/components/common/register";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { IMAGES } from "src/assets";
import { useSettings } from "src/@core/hooks/useSettings";
import BlankLayout from "@/@core/layouts/BlankLayout";
import { LOGIN_ROUTE } from "@/enums/defaultRoute.enums";

export default function Register() {
  const { settings, saveSettings } = useSettings();
  const router = useRouter();
  const { data: session } = useSession();
  useEffect(() => {
    if (session && session.user) {
      router.push(LOGIN_ROUTE[session.user.role]);
    }
  }, [router, session]);

  useEffect(() => {
    saveSettings({
      ...settings,
      appBar: "hidden",
    });
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        zIndex: "5",
      }}
    >
      <Container maxWidth="xl">
        <CondensedNavbar url="https://24hrtherapy.co.uk" title="site" />
        <RegisterCards />
        <FooterPoliciesSection />
      </Container>
      <Image
        src={IMAGES.registerVector}
        alt="Hero Image"
        style={{
          position: "absolute",
          maxWidth: "100%",
          height: "auto",
          bottom: "0",
          right: "0",
          width: "100%",
          zIndex: "-10",
        }}
      />
    </Box>
  );
}
Register.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;
Register.authGuard = false;
