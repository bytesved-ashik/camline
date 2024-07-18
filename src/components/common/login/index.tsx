import { Box, Button, CircularProgress, Grid, Paper, Typography } from "@mui/material";
import React, { FormEventHandler, useEffect, useRef, useState } from "react";
import { Recaptcha } from "src/components/common";
import Checkbox from "@mui/material/Checkbox";
import ReCAPTCHA from "react-google-recaptcha";
import { signIn } from "next-auth/react";
import Image from "next/image";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Link from "@mui/material/Link";
import CondensedNavbar from "../navbar/CondensedNavbar";
import * as toast from "src/utils/toast";
import { IMAGES } from "src/assets";
import { useSettings } from "src/@core/hooks/useSettings";
import { googleReCaptchaEnabled } from "@/constants/environmentConstant";

export default function LoginComponent() {
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const [showPassword, setShowPassword] = React.useState(false);
  const { settings, saveSettings } = useSettings();
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const reCAPTCHARef = useRef<ReCAPTCHA>();
  const [reCAPTCHAError, setreCAPTCHAError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      if (googleReCaptchaEnabled && reCAPTCHARef.current) {
        const token = reCAPTCHARef.current.getValue();

        if (!token) {
          setreCAPTCHAError("Please verify that you are not a robot.");

          return;
        }
        reCAPTCHARef.current.reset();
        setreCAPTCHAError("");
      }
      setIsLoading(true);
      const result = await signIn("credentials", {
        email: emailRef.current,
        password: passwordRef.current,
        rememberMe: rememberMe,
        redirect: false,
      });

      if (result?.error) {
        if (result.status === 401) {
          if (result.error === "Unauthorized") {
            toast.error("Invalid Credentials");
            setIsLoading(false);

            return;
          }
          toast.error(result.error);
          setIsLoading(false);

          return;
        }
        toast.error(result.error);
        setIsLoading(false);
      }
    } catch (e) {
      if (googleReCaptchaEnabled && reCAPTCHARef.current) {
        reCAPTCHARef.current.reset();
      }
      toast.error("ReCaptcha Error. Try Again");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    saveSettings({
      ...settings,
      appBar: "hidden",
    });
  }, []);

  return (
    <Paper
      sx={{
        borderRadius: "0",
        height: {
          xs: "auto", //0
          sm: "auto", //600
          md: "100vh", //900
        },

        background: "linear-gradient(147.95deg, #546FFF 32.28%, rgba(27, 45, 139, 0) 103.99%)",
      }}
    >
      <Grid
        container
        sx={{
          maxWidth: "100%",
          width: "100%",
          backgroundSize: "cover",
          minHeight: {
            xs: "auto", //0
            sm: "auto", //600
            md: "100vh", //900
          },
        }}
      >
        <Grid
          item
          xs={12}
          lg={7}
          md={6}
          sx={{
            position: "relative",
            padding: {
              xs: "20px",
              sm: "35px 20px",
              lg: "70px 60px 30px",
            },
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: "100%",
            margin: "0",
            background: "url(../../images/03-Sky.png)",
            backgroundPosition: "bottom center",
            backgroundSize: "cover",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              marginBottom: {
                sm: "1rem",
                xs: "0",
              },
              color: "#fff",
              fontWeight: "700",
              fontSize: {
                xs: "1.25rem",
                sm: "2rem",
                lg: "3.75rem",
              },
              letterSpacing: "-1.5px",
              lineHeight: "1",
            }}
          >
            <Typography
              variant="inherit"
              sx={{
                opacity: "60%",
                color: "#fff",
                fontWeight: "700",
                fontSize: {
                  xs: "1.25rem",
                  sm: "2rem",
                  lg: "3.75rem",
                },
                letterSpacing: "-1.5px",
                lineHeight: "1",
                display: "inline-block",
              }}
            >
              Embrace
            </Typography>{" "}
            positive change and achieve inner peace{" "}
            <Typography
              variant="inherit"
              sx={{
                opacity: "60%",
                color: "#fff",
                fontWeight: "700",
                fontSize: {
                  xs: "1.25rem",
                  sm: "2rem",
                  lg: "3.75rem",
                },
                letterSpacing: "-1.5px",
                lineHeight: "1",
                display: "inline-block",
              }}
            >
              {" "}
              with our professional
            </Typography>{" "}
            therapy services.
          </Typography>
          <Typography
            sx={{
              display: {
                xs: "none",
                md: "block",
              },
              color: "#fff",
              fontSize: {
                xs: "0.875rem",
                sm: "1rem",
                xl: "1.125rem",
              },
              letterSpacing: "0.14px",
            }}
          >
            © 2023 Camline Enterprises Ltd. Company reg number: 14444669 2023. All rights reserved.
          </Typography>
          <Box
            sx={{
              position: "absolute",
              maxWidth: "100%",
              bottom: {
                lg: "80px",
                xs: "10px",
              },
              left: "0",
              opacity: "0.50",
              display: {
                xs: "none",
                md: "inline-block",
              },
            }}
          >
            <Image src={IMAGES.loginVector} alt="login Vector" style={{ maxWidth: "100%" }} />
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          lg={5}
          md={6}
          sx={{
            display: "flex",
            borderRadius: {
              md: "20px 0px 0px 20px",
              xs: "0px 20px 20px 0px",
            },
            overflow: "hidden",
          }}
        >
          <Paper
            elevation={0}
            sx={{
              width: "100%",
              borderRadius: "20px 0px 0px 20px",
              padding: {
                xs: "20px",
                lg: "50px 35px",
                sm: "35px 20px",
              },
              display: "flex",
              flexDirection: "column",
            }}
          >
            <form onSubmit={handleSubmit} style={{ display: "flex", flex: "1", flexDirection: "column" }}>
              <CondensedNavbar url="https://24hrtherapy.co.uk" title="site" />
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="h3"
                  component={"h3"}
                  sx={{
                    marginBottom: "16px",
                    fontSize: {
                      lg: "3rem",
                      xs: "1.75rem",
                    },
                  }}
                >
                  Sign in
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    marginBottom: {
                      lg: "36px",
                      xs: "16px",
                    },
                    letterSpacing: "0.1px",
                    color: "text.secondary",
                  }}
                >
                  Please sign-in to your account and start with your therapy
                </Typography>
                <FormControl
                  variant="outlined"
                  margin="normal"
                  sx={{
                    marginBottom: {
                      lg: "28px",
                      xs: "1rem",
                    },
                    marginTop: 0,
                  }}
                >
                  <InputLabel htmlFor="outlined-adornment-password">Email</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    type="email"
                    autoFocus={true}
                    onChange={(e) => (emailRef.current = e.target.value)}
                    label="Email"
                    required
                  />
                </FormControl>
                <FormControl
                  variant="outlined"
                  margin="normal"
                  sx={{
                    marginBottom: {
                      lg: "28px",
                      xs: "1rem",
                    },
                    marginTop: 0,
                  }}
                >
                  <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    type={showPassword ? "text" : "password"}
                    onChange={(e) => (passwordRef.current = e.target.value)}
                    required
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                  />
                </FormControl>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Checkbox
                      {...label}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      checked={rememberMe}
                      sx={{ padding: 0, marginRight: "8px" }}
                    />
                    <Typography color="#6D788D" sx={{ fontSize: "0.875rem" }}>
                      Remember me
                    </Typography>
                  </Box>
                  <Link href="/auth/forgot-password" underline="none">
                    {" "}
                    <Typography color="#546FFF" sx={{ fontSize: "0.875rem" }}>
                      Forgot password?
                    </Typography>
                  </Link>
                </Box>

                <Box
                  sx={{
                    marginBottom: "1rem",
                    marginTop: {
                      lg: "30px",
                      xs: "1rem",
                    },
                  }}
                >
                  <Recaptcha ref={reCAPTCHARef} googleReCaptchaEnabled={googleReCaptchaEnabled} error={reCAPTCHAError} />
                </Box>
                <Button type="submit" variant="contained" color="primary" fullWidth disabled={isLoading}>
                  {isLoading ? <CircularProgress color="inherit" size={20} sx={{ mr: 2 }} /> : "Login"}
                </Button>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "3px",
                    flexWrap: "wrap",
                  }}
                  marginTop="20px"
                >
                  <Typography
                    sx={{
                      fontSize: "16px",
                      lineHeight: "1",
                      color: "#6D788D",
                    }}
                  >
                    New on our platform?
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "16px",
                      lineHeight: "1",
                      color: "#546FFF",
                    }}
                  >
                    <Link href="/auth/register" sx={{ textDecoration: "none" }}>
                      {" "}
                      Create an account
                    </Link>
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    display: {
                      xs: "block",
                      lg: "none",
                    },
                    textAlign: "center",
                    color: "#6D788D",
                    fontSize: {
                      xs: "0.775rem",
                      sm: "1rem",
                      md: "1.125rem",
                    },
                    letterSpacing: "0.14px",
                    marginTop: "30px",
                  }}
                >
                  © 2023 Camline Enterprises Ltd. Company Reg number: 14444669 2023. All rights reserved.
                </Typography>
              </Box>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
}
