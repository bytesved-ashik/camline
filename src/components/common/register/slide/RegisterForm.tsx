"use client";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import QuestionCardTitle from "./QuestionCardTitle";
import { ChangeEventHandler, FormEventHandler, useEffect, useState } from "react";
import { useCustomMutation } from "src/hooks/useCustomMutation";
import { IRegisterResponse } from "src/types/interfaces/auth.interface";
import { Dispatch, SetStateAction } from "react";
import * as toast from "src/utils/toast";
import { authRegister } from "@/services/auth.service";
import { ROLE } from "@/enums/role.enums";
import { IUserRegisterRequest } from "src/types/interfaces/auth.interface";
import { ITherapistRegisterRequest } from "src/types/interfaces/auth.interface";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import Icon from "src/@core/components/icon";
import PeopleIcon from "@mui/icons-material/SupervisedUserCircle";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { postLocalMedia } from "@/services/media.service";
import ReactSelectCategory from "./ReactSelectCategory";
import "react-phone-number-input/style.css";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { makeStyles } from "@material-ui/core";

interface IProps {
  handleNext: (skipStep?: boolean) => void;
  handleBack: () => void;
  maxSteps?: number;
  activeStep?: number;
  role: ROLE;
  setEmail: Dispatch<SetStateAction<string>>;
}

const useStyles = makeStyles({
  phone_input: {
    width: "49%",
    border: " 1px solid #d8d8dd",
    marginBottom: "12px",
    borderRadius: "8px",
    paddingLeft: "10px",
    "&&input": {
      border: "none",
    },
  },
});

export default function RegisterForm({ handleNext, handleBack, role, setEmail }: IProps) {
  const classes = useStyles();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [emailData, setEmailData] = useState("");
  const [phoneData, setPhoneData] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const urlParams = new URLSearchParams(window.location.search);
  const referCode = urlParams.get("refercode");
  const [referalCode, setReferalcode] = useState("");
  const [VATNo, setVATNo] = useState("");
  const [gender, setGender] = useState("");

  // Therapist Document upload
  const [profileImgId, setProfileImgId] = useState<string>("");
  const [profileImgName, setProfileImgName] = useState<string>("");
  const [isProfileImgUploading, setIsProfileImgUploading] = useState(false);
  const [terms, setTerms] = useState(false);
  const [bio, setBio] = useState("");

  const [validPhone, setValidPhone] = useState(false);

  const [docs, setDocs] = useState([
    {
      name: "",
      placeholder: "Accreditation/Registration",
      isloading: false,
      isRequired: true,
      documentID: [],
    },
    {
      name: "",
      placeholder: "Insurance Certificate",
      isloading: false,
      isRequired: true,
      documentID: [],
    },
    {
      name: "",
      placeholder: "Enhanced DBS Certificate (if working with minors)",
      isloading: false,
      documentID: [],
      isRequired: false,
    },
  ]);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  useEffect(() => {
    if (referCode) {
      setReferalcode(referCode);
    }
  }, []);

  const { mutate: register, isLoading } = useCustomMutation<
    {
      registerRequest: IUserRegisterRequest | ITherapistRegisterRequest;
      role: string;
    },
    IRegisterResponse
  >({
    api: authRegister,
    success: "Registered Successfully",
    error: "Error",
    onSuccess: () => {
      handleNext();
      setEmail(emailData);
    },
  });

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (!terms) {
      toast.error("Please agree to the terms");

      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");

      return;
    }

    if (selectedCategories.length === 0) {
      toast.error("Please select at least one option");

      return;
    }

    const data = {
      firstName: firstName,
      lastName: lastName,
      email: emailData,
      password: password,
      roles: [role],
      categories: selectedCategories,
      phoneNumber: phoneData,
      gender,
    };
    if (role === ROLE.THERAPIST) {
      if (isProfileImgUploading) {
        return toast.success("Profile image is uploading");
      }

      const doc: any = [];
      for (let i = 0; i < docs.length; i++) {
        if (docs[i].isRequired) {
          if (docs[i].documentID.length === 0) {
            return toast.error("Please upload the required files");
          }
        }

        if (docs[i].documentID.length > 0) {
          doc.push(...docs[i].documentID);
        }
      }

      if (!profileImgId || doc.length === 0) {
        return toast.error("Please upload the required files");
      }

      register({
        registerRequest: {
          ...data,
          VATNumber: VATNo,
          referralCode: referalCode ?? "",
          profilePicture: profileImgId,
          medias: doc,
          bio,
        },
        role: ROLE.THERAPIST,
      });

      return;
    }

    register({
      registerRequest: { ...data, referralCode: referalCode ?? "" },
      role: ROLE.USER,
    });
  };

  const UploadStatus = ({ isImageUploading, imageName }: { isImageUploading: boolean; imageName: string }) => {
    if (isImageUploading) {
      return <CircularProgress color="inherit" size={20} sx={{ position: "absolute", right: "10px", mr: 2 }} />;
    }

    return (
      <FileUploadIcon
        style={{
          position: "absolute",
          right: "10px",
          marginRight: 2,
          color: imageName ? "546FFF" : "#4C4E648A",
        }}
      />
    );
  };

  const handelProfilePictureChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setIsProfileImgUploading(true);
    if (!e.target.files) return;
    const formData = new FormData();
    formData.append("files[]", e?.target?.files[0]);
    postLocalMedia(formData)
      .then((res) => {
        setProfileImgId(res.data[0]._id);
        setIsProfileImgUploading(false);
      })
      .catch((err) => {
        setIsProfileImgUploading(false);
        setProfileImgId("");
        setProfileImgName("");
        toast.error(err?.response?.data?.message);
      });
    setProfileImgName(e?.target?.files?.[0].name);
  };

  const handelVerificationDocumentChange = (e: any, index: number) => {
    if (!e.target.files) return;
    if (e?.target?.files.length < 0) {
      return toast.error("Please upload required certificates.");
    }

    const formData = new FormData();
    const name = e?.target?.files[0].name;
    formData.append("files[]", e?.target?.files[0]);
    const doc = JSON.parse(JSON.stringify(docs));
    doc[index].name = name;
    doc[index].isloading = true;
    setDocs(doc);
    postLocalMedia(formData)
      .then((res) => {
        const documents = [];
        for (let i = 0; i < res.data.length; i++) {
          documents.push({
            mediaId: [res.data[i]._id],
            type: "diploma-certification",
          });
        }
        const doc = JSON.parse(JSON.stringify(docs));
        doc[index].name = name;
        doc[index].isloading = false;
        doc[index].documentID = documents;
        setDocs(doc);
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message);
      });
  };

  const disableButton =
    role === ROLE.USER
      ? !firstName ||
        !lastName ||
        !emailData ||
        !phoneData ||
        !password ||
        !confirmPassword ||
        !selectedCategories ||
        !gender ||
        !terms ||
        !validPhone
      : !firstName ||
        !lastName ||
        !emailData ||
        !phoneData ||
        !password ||
        !confirmPassword ||
        !selectedCategories ||
        !gender ||
        !profileImgId ||
        !docs[0].documentID ||
        !docs[1].documentID ||
        !terms ||
        !validPhone;

  useEffect(() => {
    if (phoneData && isValidPhoneNumber(phoneData)) {
      setValidPhone(true);
    } else {
      setValidPhone(false);
    }
  }, [phoneData]);

  return (
    <Box sx={{ margin: { xs: "0 auto", lg: "6% auto" }, maxWidth: "900px" }}>
      <Paper elevation={8} sx={{ margin: "auto" }}>
        <Box sx={{ padding: "40px 80px" }}>
          <Box
            sx={{
              position: "relative",
              marginBottom: "20px",
            }}
          >
            <Button
              variant="text"
              sx={{
                display: "flex",
                alignItems: "center",
                padding: 0,
                color: "inherit",
              }}
              onClick={handleBack}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <ArrowBackIosIcon style={{ marginRight: "0px" }} />
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: "normal",
                    whiteSpace: "nowrap",
                    textTransform: "capitalize",
                  }}
                >
                  Go Back
                </Typography>
              </Box>
            </Button>
          </Box>
          <QuestionCardTitle
            title="Provide your personal details"
            description="Fill in the form below to complete your onboarding"
          />
          <form onSubmit={handleSubmit}>
            <Grid container spacing={4} mt={5} mb={5} justifyContent={"space-between"}>
              <TextField
                label="First Name"
                type="text"
                variant="outlined"
                required
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
                sx={{ width: "49%" }}
              />
              <TextField
                label="Last Name"
                type="text"
                variant="outlined"
                required
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
                sx={{ width: "49%", mb: 3 }}
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                variant="outlined"
                required
                onChange={(e) => setEmailData(e.target.value)}
                value={emailData}
                sx={{ mb: 3, width: "49%" }}
              />
              <PhoneInput
                className={classes.phone_input}
                placeholder="Enter phone number"
                value={phoneData}
                defaultCountry="GB"
                onChange={(e: any) => setPhoneData(e)}
                limitMaxLength={true}
                rules={{
                  required: true,
                }}
                numberInputProps={{ style: { border: "none" } }}
                disableCountryCode={true}
              />

              {role === ROLE.THERAPIST ? (
                <>
                  <TextField
                    multiline
                    fullWidth
                    type="text"
                    placeholder="tell about yourself"
                    label="Bio"
                    sx={{ width: "100%", mb: 3 }}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />

                  <TextField
                    label="VAT No"
                    type="text"
                    variant="outlined"
                    onChange={(e) => setVATNo(e.target.value)}
                    value={VATNo}
                    sx={{ width: "49%" }}
                  />
                </>
              ) : null}
              <TextField
                label="Referral Code"
                type="text"
                variant="outlined"
                onChange={(e) => setReferalcode(e.target.value)}
                value={referalCode}
                sx={{ width: role === ROLE.THERAPIST ? "49%" : "100%", mb: 3 }}
              />

              <FormControl sx={{ mb: 3 }} fullWidth variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={showPassword ? "text" : "password"}
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
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
              <FormControl sx={{ mb: 3 }} fullWidth variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">Confirm Password</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={showPassword ? "text" : "password"}
                  required
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                  sx={{ mb: 3 }}
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

              <Box sx={{ width: "49%" }}>
                <ReactSelectCategory
                  role={role}
                  selectedCategories={selectedCategories}
                  setSelectedCategories={setSelectedCategories}
                />
              </Box>
              <Box sx={{ width: "40%" }}>
                <FormControl sx={{ justifyContent: "center" }} required>
                  <FormLabel id="demo-row-radio-buttons-group-label">Gender</FormLabel>
                  <RadioGroup
                    row
                    aria-required
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <FormControlLabel value="Female" control={<Radio required />} label="Female" />
                    <FormControlLabel value="Male" control={<Radio required />} label="Male" />
                    <FormControlLabel value="Other" control={<Radio required />} label="Other" />
                  </RadioGroup>
                </FormControl>
              </Box>

              {role === ROLE.THERAPIST && (
                <>
                  <Typography
                    sx={{
                      textAlign: "center",
                      fontWeight: "700",
                      fontSize: "1rem",
                      lineHeight: "133.4%",
                      marginBottom: "12px",
                      color: "text.black",
                    }}
                  >
                    Upload your profile picture
                  </Typography>
                  <Button
                    id="therapist-profile-upload-image"
                    component="label"
                    htmlFor="therapist-profile-upload-image-input"
                    variant="outlined"
                    sx={{
                      width: "100%",
                      justifyContent: "flex-start",
                      textTransform: "initial",
                      minHeight: "78px",
                      textAlign: "left",
                      border: "1px solid  rgba(76, 78, 100, 0.22)",
                      ":hover": {
                        outline: "none",
                      },
                      marginBottom: "20px",
                      gap: "20px",
                    }}
                  >
                    <FormControlLabel
                      control={
                        <input
                          type="file"
                          accept="image/jpeg, image/png, image/jpeg"
                          onChange={handelProfilePictureChange}
                          id="therapist-profile-upload-image-input"
                          style={{ display: "none" }}
                        />
                      }
                      labelPlacement="top"
                      label={
                        profileImgName ? (
                          <Typography variant="body2" sx={{ color: "#000" }}>
                            {profileImgName}
                          </Typography>
                        ) : (
                          <Typography variant="body2">Upload your profile picture ( .jpg, .png )</Typography>
                        )
                      }
                    />
                    <UploadStatus isImageUploading={isProfileImgUploading} imageName={profileImgName} />
                  </Button>
                  <br />
                  <Typography
                    sx={{
                      textAlign: "center",
                      fontWeight: "700",
                      fontSize: "1rem",
                      lineHeight: "133.4%",
                      marginBottom: "12px",
                      color: "text.black",
                    }}
                  >
                    Upload your certificates
                  </Typography>

                  {docs.map((val, index) => (
                    <Button
                      key={`documents-${index}`}
                      id="therapist-verification-document"
                      component="label"
                      variant="outlined"
                      sx={{
                        width: "100%",
                        justifyContent: "flex-start",
                        textTransform: "initial",
                        minHeight: "78px",
                        textAlign: "left",
                        border: "1px solid  rgba(76, 78, 100, 0.22)",
                        ":hover": {
                          outline: "none",
                        },
                        marginBottom: "10px",
                      }}
                    >
                      <FormControlLabel
                        control={
                          <input
                            hidden
                            type="file"
                            accept="image/jpeg, image/png, image/jpeg, application/pdf"
                            onChange={(e) => handelVerificationDocumentChange(e, index)}
                            id="therapist-verification-document-input"
                          />
                        }
                        labelPlacement="top"
                        label={
                          val.name ? (
                            <Typography variant="body2">{val.name}</Typography>
                          ) : (
                            <Typography variant="body2">{val.placeholder} ( .pdf, .jpg, .png )</Typography>
                          )
                        }
                      />
                      <UploadStatus imageName={val.name} isImageUploading={val.isloading} />
                    </Button>
                  ))}
                </>
              )}
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Checkbox id="terms-condition" onClick={() => setTerms(true)} />
                <InputLabel htmlFor="terms-condition">
                  Agree to the{" "}
                  <span
                    style={{
                      color: "#546FFF",
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                    onClick={() => open("/terms")}
                  >
                    Terms & Conditions
                  </span>
                </InputLabel>
              </Box>
            </Grid>
            <Stack sx={{ flexDirection: "row", alignItems: "center" }}>
              <Box
                sx={{
                  background: "linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #666CFF",
                  marginRight: "10px",
                  width: "37px",
                  height: "37px",
                  borderRadius: "100px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {role === ROLE.THERAPIST && <Icon icon="material-symbols:physical-therapy" color="#546FFF" />}
                {role === ROLE.USER && <PeopleIcon sx={{ color: "#546FFF" }} />}
              </Box>
              <Typography
                sx={{
                  color: "#546FFF",
                  fontWeight: "700",
                  textTransform: "capitalize",
                }}
              >
                {role}
              </Typography>
              <Box sx={{ flex: "1", textAlign: "right" }}>
                <Button type="submit" disabled={isLoading || disableButton} variant="contained">
                  {isLoading ? <CircularProgress color="inherit" size={20} sx={{ mr: 2 }} /> : null} Submit
                </Button>
              </Box>
            </Stack>
          </form>
        </Box>
      </Paper>
    </Box>
  );
}
