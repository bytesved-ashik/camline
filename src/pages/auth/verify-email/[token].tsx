"use client";
import FooterPoliciesSection from "src/components/common/footer/PoliciesSection";
import { Box, Container } from "@mui/material";
import Image from "next/image";
import CondensedNavbar from "src/components/common/navbar/CondensedNavbar";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { IMAGES } from "src/assets";
import { useSettings } from "src/@core/hooks/useSettings";
import BlankLayout from "@/@core/layouts/BlankLayout";
import { LOGIN_ROUTE } from "@/enums/defaultRoute.enums";
import RegistrationVerify from "@/components/common/register/slide/RegistrationVerify";
import { useCustomMutation } from "@/hooks/useCustomMutation";
import { verifyEmail } from "@/services/auth.service";

type Props = {
  token: string;
};

export default function VerifyEmail({ token }: Props) {
  const { settings, saveSettings } = useSettings();
  const router = useRouter();
  const { data: session } = useSession();
  const [varifyMessage, setVerifyMessage] = useState<string>("Please wait while we verify your email.");
  const { mutate: verify } = useCustomMutation<{ token: string }, any>({
    api: verifyEmail,
    success: "Email Verified Successfully",
    error: "Error",
    onSuccess: () => {
      setVerifyMessage("Email verified successfull.");
    },
    onError: (data: any) => {
      setVerifyMessage(data?.response?.data?.message);
    },
  });

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

  useEffect(() => {
    if (token) {
      verify({ token });
    }
  }, [token]);

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
        <RegistrationVerify verify={varifyMessage} />
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
VerifyEmail.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;
VerifyEmail.authGuard = false;

export async function getServerSideProps(context: any) {
  const { token } = context.query;
  console.log(token);

  return { props: { token } };
}
