import { FormEventHandler, ReactNode } from "react";
import Link from "next/link";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import Icon from "src/@core/components/icon";
import BlankLayout from "src/@core/layouts/BlankLayout";
import MuiCard, { CardProps } from "@mui/material/Card";
import { IMAGES } from "@/assets";
import { CardContent } from "@mui/material";
import { forgotPassword } from "@/services/auth.service";
import * as toast from "@/utils/toast";
import { useRouter } from "next/router";

const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up("sm")]: { width: 450 },
}));

const ForgotPassword = () => {
  const router = useRouter();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const { message } = await forgotPassword(email);
    if (message) {
      toast.success("otp sent successfully");
      router.push(
        {
          pathname: "/auth/reset-password",
          query: { email: email },
        },
        "/auth/reset-password "
      );
    }
  };

  return (
    <Box className="content-center">
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ p: (theme) => `${theme.spacing(15.5, 7, 8)} !important` }}>
          <Box sx={{ mb: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Image
              src={IMAGES.Logo}
              alt="24hrtherapy"
              width={98}
              height={34}
              style={{ maxWidth: "100%", height: "auto", width: "auto" }}
            />
          </Box>
          <Box sx={{ mb: 6.5 }}>
            <Typography variant="h5" sx={{ mb: 1.5, letterSpacing: "0.18px", fontWeight: 600 }}>
              Forgot Password?
            </Typography>
            <Typography variant="body2">
              Enter your email and we&prime;ll send you instructions to reset your password
            </Typography>
          </Box>
          <form onSubmit={handleSubmit}>
            <TextField autoFocus type="email" name="email" label="Email" sx={{ display: "flex", mb: 4 }} />
            <Button fullWidth size="large" type="submit" variant="contained" sx={{ mb: 5.25 }}>
              SUBMIT
            </Button>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Typography
                component={Link}
                href="/auth/login"
                sx={{
                  display: "flex",
                  "& svg": { mr: 1.5 },
                  alignItems: "center",
                  color: "primary.main",
                  textDecoration: "none",
                  justifyContent: "center",
                }}
              >
                <Icon icon="mdi:chevron-left" fontSize="2rem" />
                <span>Back to login</span>
              </Typography>
            </Box>
          </form>
        </CardContent>
      </Card>
      <Box
        sx={{
          position: "absolute",
          left: "0",
          right: "0",
          bottom: "7%",
        }}
      >
        <Image src={IMAGES.Illustration2} alt="Illustration2" style={{ maxWidth: "100%", height: "auto", width: "100%" }} />
      </Box>
    </Box>
  );
};

ForgotPassword.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;
ForgotPassword.authGuard = false;
export default ForgotPassword;
