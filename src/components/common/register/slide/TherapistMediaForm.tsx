import { Box, Button, CircularProgress, FormControlLabel, Grid, Paper, Stack, Typography } from "@mui/material";
import QuestionCardTitle from "./QuestionCardTitle";
import { ChangeEventHandler, useEffect, useState } from "react";
import { useCustomMutation } from "src/hooks/useCustomMutation";
import {
  IRegisterResponse,
  ITherapistAvailability,
  ITherapistMediaUploadRequest,
} from "src/types/interfaces/auth.interface";
import { Dispatch, SetStateAction } from "react";
import SlideProgressBar from "./SlideProgressBar";
import { authRegister } from "@/services/auth.service";
import { ROLE } from "@/enums/role.enums";
import { IUserRegisterRequest } from "src/types/interfaces/auth.interface";
import { ITherapistRegisterRequest } from "src/types/interfaces/auth.interface";
import * as toast from "@/utils/toast";
import { postLocalMedia } from "@/services/media.service";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import FileUploadIcon from "@mui/icons-material/FileUpload";

interface IProps {
  handleNext: () => void;
  handleBack: () => void;
  maxSteps: number;
  activeStep: number;
  setEmail: Dispatch<SetStateAction<string>>;
  therapistFormData: ITherapistRegisterRequest;
  role: ROLE;
  avaibilityData: ITherapistAvailability;
}

export default function TherapistMediaForm({
  therapistFormData,
  setEmail,
  role,
  activeStep,
  maxSteps,
  handleNext,
  handleBack,
  avaibilityData,
}: IProps) {
  const [profileImgId, setProfileImgId] = useState<string>("");
  const [profileImgName, setProfileImgName] = useState<string>("");
  const [verificationDocumentName, setVerificationDocumentName] = useState<string[]>([]);
  const [verificationDocumentId, setVerificationDocumentId] = useState<ITherapistMediaUploadRequest[]>([]);
  const [isProfileImgUploading, setIsProfileImgUploading] = useState(false);
  const [isVerificationDocUploading, setIsVerificationDocUploading] = useState(false);

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

  const handelVerificationDocumentChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!e.target.files) return;
    if (e?.target?.files.length < 0) {
      return toast.error("Please upload required certificates.");
    }
    setIsVerificationDocUploading(true);
    const formData = new FormData();
    const names = [];
    for (let i = 0; i < e.target.files.length; i++) {
      formData.append("files[]", e?.target?.files[i]);
      names.push(e?.target?.files?.[i].name);
    }
    setVerificationDocumentName(names);
    postLocalMedia(formData)
      .then((res) => {
        const doc = [];
        for (let i = 0; i < res.data.length; i++) {
          doc.push({
            mediaId: [res.data[i]._id],
            type: "diploma-certification",
          });
        }
        setVerificationDocumentId(doc);
        setIsVerificationDocUploading(false);
      })
      .catch((err) => {
        setIsVerificationDocUploading(false);
        setVerificationDocumentId([]);
        setVerificationDocumentName([]);
        toast.error(err?.response?.data?.message);
      });
  };

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
      setEmail(therapistFormData.email);
      handleNext();
    },
  });

  useEffect(() => {
    if (Object.keys(therapistFormData).length === 0) {
      setProfileImgId("");
      setProfileImgName("");
      setVerificationDocumentId([]);
      setVerificationDocumentName([]);
    }
  }, [therapistFormData]);

  const handleSubmit = async () => {
    if (isProfileImgUploading || isVerificationDocUploading) {
      return toast.success("Document is uploading");
    }

    if (!profileImgId || verificationDocumentId.length === 0) {
      return toast.error("Please upload the required files");
    }
    setEmail(therapistFormData.email);
    register({
      registerRequest: {
        ...therapistFormData,
        profilePicture: profileImgId,
        medias: verificationDocumentId,
        therapistAvailability: avaibilityData,
      },
      role: ROLE.THERAPIST,
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

  return (
    <Box sx={{ margin: { xs: "0 auto", lg: "5% auto" }, maxWidth: "900px" }}>
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
            title="Finally, provide your personal details"
            description="Fill in the form below to complete your onboarding"
          />
          {role === ROLE.THERAPIST ? <Typography variant="body2">Step 2 of 2 - Upload files</Typography> : null}

          <Grid container spacing={4} mt={5} mb={5} justifyContent={"space-between"}>
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
            <Button
              id="therapist-verification-document"
              component="label"
              htmlFor="therapist-verification-document-input"
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
              }}
            >
              <FormControlLabel
                control={
                  <input
                    hidden
                    type="file"
                    accept="image/jpeg, image/png, image/jpeg, application/pdf, .docx, .doc"
                    onChange={handelVerificationDocumentChange}
                    id="therapist-verification-document-input"
                    multiple
                  />
                }
                labelPlacement="top"
                label={
                  verificationDocumentName.length > 0 ? (
                    <Typography variant="body2">{verificationDocumentName.toString()}</Typography>
                  ) : (
                    <Typography variant="body2">Upload your certificates ( .pdf, .jpg, .docx )</Typography>
                  )
                }
              />
              <UploadStatus imageName={verificationDocumentName.toString()} isImageUploading={isVerificationDocUploading} />
            </Button>
          </Grid>
          <Stack sx={{ flexDirection: "row", alignItems: "center" }}>
            <SlideProgressBar activeStep={activeStep} maxSteps={maxSteps} />
            <Box sx={{ flex: "1", textAlign: "right" }}>
              <Button onClick={handleSubmit} disabled={isLoading} variant="contained">
                {isLoading ? <CircularProgress color="inherit" size={20} sx={{ mr: 2 }} /> : <>Submit</>}
              </Button>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}
