import { useState, SyntheticEvent, ChangeEvent, MouseEvent, ReactNode, KeyboardEvent } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import { styled, useTheme } from "@mui/material/styles";
import MuiCard, { CardProps } from "@mui/material/Card";
import InputAdornment from "@mui/material/InputAdornment";
import Icon from "src/@core/components/icon";
import BlankLayout from "src/@core/layouts/BlankLayout";
import Image from "next/image";
import { IMAGES } from "@/assets";
import { useRouter } from "next/router";
import * as toast from "@/utils/toast";
import { resetPassword } from "@/services/auth.service";
import FormHelperText from "@mui/material/FormHelperText";
import Cleave from "cleave.js/react";
import { useForm, Controller } from "react-hook-form";
import { hexToRGBA } from "src/@core/utils/hex-to-rgba";
import "cleave.js/dist/addons/cleave-phone.us";

interface State {
  newPassword: string;
  showNewPassword: boolean;
  confirmNewPassword: string;
  showConfirmNewPassword: boolean;
}

const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up("sm")]: { width: "28rem" },
}));

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: "none",
  marginLeft: theme.spacing(1),
  color: theme.palette.primary.main,
}));

const CleaveInput = styled(Cleave)(({ theme }) => ({
  maxWidth: 50,
  textAlign: "center",
  height: "50px !important",
  fontSize: "150% !important",
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  "&:not(:last-child)": {
    marginRight: theme.spacing(2),
  },
  "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
    margin: 0,
    WebkitAppearance: "none",
  },
}));

const defaultValues: { [key: string]: string } = {
  val1: "",
  val2: "",
  val3: "",
  val4: "",
  val5: "",
  val6: "",
};

const ResetPassword = () => {
  const [values, setValues] = useState<State>({
    newPassword: "",
    showNewPassword: false,
    confirmNewPassword: "",
    showConfirmNewPassword: false,
  });
  const [isOtpSubmitted, setIsOtpSubmitted] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const router = useRouter();
  const { email } = router.query;
  const [isBackspace, setIsBackspace] = useState<boolean>(false);
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const errorsArray = Object.keys(errors);
  const handlePasswordSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const { newPassword, confirmNewPassword } = values;

    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match");

      return;
    }
    const params = {
      email: email as string,
      token: otp as string,
      password: newPassword,
    };

    try {
      const data = await resetPassword(params);
      if (data) {
        console.log(data);
        toast.success("password reset successfully");
        router.push("/auth/login");
      }
    } catch (error) {
      toast.error("unable to reset password");
    }
  };

  const handleNewPasswordChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value });
  };
  const handleClickShowNewPassword = () => {
    setValues({ ...values, showNewPassword: !values.showNewPassword });
  };
  const handleMouseDownNewPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleConfirmNewPasswordChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value });
  };
  const handleClickShowConfirmNewPassword = () => {
    setValues({ ...values, showConfirmNewPassword: !values.showConfirmNewPassword });
  };
  const handleMouseDownConfirmNewPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleChange = (event: ChangeEvent, onChange: (...event: any[]) => void) => {
    if (!isBackspace) {
      onChange(event);
      const form = event.target.closest("form");
      if (form) {
        const index = Array.from(form.elements).indexOf(event.target as HTMLInputElement);
        if ((form.elements[index] as HTMLInputElement).value && (form.elements[index] as HTMLInputElement).value.length) {
          (form.elements[index + 1] as HTMLInputElement)?.focus();
        }
        event.preventDefault();
      }
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Backspace") {
      setIsBackspace(true);
      const form = (event.target as Element).closest("form");
      if (form) {
        const index = Array.from(form.elements).indexOf(event.target as HTMLInputElement);
        if (index >= 1) {
          if (
            !((form.elements[index] as HTMLInputElement).value && (form.elements[index] as HTMLInputElement).value.length)
          ) {
            (form.elements[index - 1] as HTMLInputElement)?.focus();
          }
        }
      }
    } else {
      setIsBackspace(false);
    }
  };

  const renderInputs = () => {
    return Object.keys(defaultValues).map((val, index) => (
      <Controller
        key={val}
        name={val}
        control={control}
        rules={{ required: true }}
        render={({ field: { value, onChange } }) => (
          <Box
            type="tel"
            maxLength={1}
            value={value}
            autoFocus={index === 0}
            component={CleaveInput}
            onKeyDown={handleKeyDown}
            onChange={(event: ChangeEvent) => handleChange(event, onChange)}
            options={{ blocks: [1], numeral: true, numeralPositiveOnly: true }}
            sx={{ [theme.breakpoints.down("sm")]: { px: `${theme.spacing(2)} !important` } }}
          />
        )}
      />
    ));
  };

  const onSubmit = (data: any) => {
    const { val1, val2, val3, val4, val5, val6 } = data;
    const token = val1 + val2 + val3 + val4 + val5 + val6;
    setIsOtpSubmitted(true);
    setOtp(token);
  };

  return (
    <>
      {isOtpSubmitted ? (
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
              <Box sx={{ mb: 6 }}>
                <Typography variant="h5" sx={{ mb: 1.5, letterSpacing: "0.18px", fontWeight: 600 }}>
                  Reset Password
                </Typography>
                <Typography variant="body2">Your new password must be different from previously used passwords</Typography>
              </Box>
              <form noValidate autoComplete="off" onSubmit={handlePasswordSubmit}>
                <FormControl fullWidth sx={{ mb: 4 }}>
                  <InputLabel htmlFor="auth-reset-password-new-password">New Password</InputLabel>
                  <OutlinedInput
                    autoFocus
                    label="New Password"
                    value={values.newPassword}
                    id="auth-reset-password-new-password"
                    onChange={handleNewPasswordChange("newPassword")}
                    type={values.showNewPassword ? "text" : "password"}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={handleClickShowNewPassword}
                          aria-label="toggle password visibility"
                          onMouseDown={handleMouseDownNewPassword}
                        >
                          <Icon icon={values.showNewPassword ? "mdi:eye-outline" : "mdi:eye-off-outline"} />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
                <FormControl fullWidth sx={{ mb: 4 }}>
                  <InputLabel htmlFor="auth-reset-password-confirm-password">Confirm Password</InputLabel>
                  <OutlinedInput
                    label="Confirm Password"
                    value={values.confirmNewPassword}
                    id="auth-reset-password-confirm-password"
                    type={values.showConfirmNewPassword ? "text" : "password"}
                    onChange={handleConfirmNewPasswordChange("confirmNewPassword")}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          aria-label="toggle password visibility"
                          onClick={handleClickShowConfirmNewPassword}
                          onMouseDown={handleMouseDownConfirmNewPassword}
                        >
                          <Icon icon={values.showConfirmNewPassword ? "mdi:eye-outline" : "mdi:eye-off-outline"} />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
                <Button fullWidth size="large" type="submit" variant="contained" sx={{ mb: 5.25 }}>
                  Set New Password
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
            <Image
              src={IMAGES.Illustration1}
              alt="Illustration1"
              style={{ maxWidth: "100%", height: "auto", width: "100%" }}
            />
          </Box>
        </Box>
      ) : (
        <Box className="content-center">
          <Card sx={{ zIndex: 1 }}>
            <CardContent sx={{ p: (theme) => `${theme.spacing(15.5, 7, 9)} !important` }}>
              <Box sx={{ mb: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Image
                  src={IMAGES.Logo}
                  alt="24hrtherapy"
                  width={98}
                  height={34}
                  style={{ maxWidth: "100%", height: "auto", width: "auto" }}
                />
              </Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                  OTP Verification
                </Typography>
                <Typography sx={{ color: "text.secondary" }}>
                  We sent a verification code to your email. Enter the code from the email in the field below.
                </Typography>
              </Box>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    ...(errorsArray.length && {
                      "& .invalid:focus": {
                        borderColor: (theme) => `${theme.palette.error.main} !important`,
                        boxShadow: (theme) => `0 1px 3px 0 ${hexToRGBA(theme.palette.error.main, 0.4)}`,
                      },
                    }),
                  }}
                >
                  {renderInputs()}
                </Box>
                {errorsArray.length ? (
                  <FormHelperText sx={{ color: "error.main" }}>Please enter a valid OTP</FormHelperText>
                ) : null}
                <Button fullWidth type="submit" variant="contained" sx={{ mt: 4 }}>
                  Submit
                </Button>
              </form>
              <Box sx={{ mt: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography sx={{ color: "text.secondary" }}>Didn't get the mail? </Typography>
                <LinkStyled href="/auth/forgot-password">Resend</LinkStyled>
              </Box>
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
            <Image
              src={IMAGES.Illustration3}
              alt="Illustration3"
              style={{ maxWidth: "100%", height: "auto", width: "100%" }}
            />
          </Box>
        </Box>
      )}
    </>
  );
};

ResetPassword.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;
ResetPassword.authGuard = false;

export default ResetPassword;
