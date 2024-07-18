import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import Button, { ButtonProps } from "@mui/material/Button";
import { ROLE } from "@/enums/role.enums";
import { useAccountDetails } from "@/hooks/profile/useAccountDetails";
import { ElementType, useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Icon from "src/@core/components/icon";
import { rejectTherapist, updateStatus } from "@/services/user.service";
import toast from "react-hot-toast";
import ViewCertificate from "@/components/ui/dialogs/ViewCertificate";
import ReactSelectCategory from "@/components/common/register/slide/ReactSelectCategory";
import { useRouter } from "next/router";
import { postLocalMedia } from "@/services/media.service";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { makeStyles } from "@material-ui/core";
import "react-phone-number-input/style.css";
import { resendEmail } from "@/services/auth.service";
import { endSessoin } from "@/services/sessions.service";
import { postTopupAmount } from "@/services/custom.service";
import { IAvaibilityTime } from "@/types/interfaces/auth.interface";
import dayjs from "dayjs";
import moment from "moment";
import CustomTimePicker from "@/components/common/time-picker";

const ImgStyled = styled("img")(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(5),
  borderRadius: theme.shape.borderRadius,
}));

const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    textAlign: "center",
  },
}));

const useStyles = makeStyles({
  phone_input: {
    width: "100%",
    height: "100%",
    border: " 1px solid #d8d8dd",
    marginBottom: "12px",
    borderRadius: "8px",
    paddingLeft: "10px",

    "&&input": {
      border: "none",
    },
  },
});

const docName = ["Accreditation/Registration", "Insurance Certificate", "Enhanced DBS Certificate (if working with minors)"];

const TabAccount = () => {
  const {
    formData,
    open,
    imgSrc,
    profilePic,
    isLoading,
    session,
    handleFormChange,
    handleInputImageSubmit,
    saveUserDetails,
    handleConfirmation,
    handleReset,
    handleClose,
    handleInputDocumentSubmit,
    handleCloseAccountOpen,
    saveUserAvaibilityDetail,
  } = useAccountDetails();
  const classes = useStyles();
  const [categories, setCategories] = useState<string[]>([]);
  const [statusLoading, setStatusLoading] = useState(false);
  const [status, setStatus] = useState(formData?.status);
  const [rejectModal, setRejectModal] = useState(false);
  const [reason, setReason] = useState("");
  const router = useRouter();
  const [topupAmount, setTopupAmount] = useState<number>();
  const [topupLoading, setTopupLoading] = useState(false);

  const [emailLoading, setEmailLoading] = useState(false);
  const [avaibility, setAvaibility] = useState<string>("24");
  const day = moment().format("YYYY-MM-DD");
  const [avaibilityTime, setAvaibilityTime] = useState<IAvaibilityTime[]>([
    {
      dayInString: "Monday",
      startDate: null,
      endDate: null,
    },
    {
      dayInString: "Tuesday",
      startDate: null,
      endDate: null,
    },
    {
      dayInString: "Wednesday",
      startDate: null,
      endDate: null,
    },
    {
      dayInString: "Thursday",
      startDate: null,
      endDate: null,
    },
    {
      dayInString: "Friday",
      startDate: null,
      endDate: null,
    },
    {
      dayInString: "Saturday",
      startDate: null,
      endDate: null,
    },
    {
      dayInString: "Sunday",
      startDate: null,
      endDate: null,
    },
  ]);
  const [docs, setDocs] = useState([
    {
      name: "",
      placeholder: "Accreditation/Registration",
      isloading: false,
      isRequired: true,
      documentID:
        formData?.medias && formData.medias[0]
          ? [
              {
                mediaId: [formData.medias[0]._id],
                type: "diploma-certification",
              },
            ]
          : [],
      isUpdate: false,
    },
    {
      name: "",
      placeholder: "Insurance Certificate",
      isloading: false,
      isRequired: true,
      documentID:
        formData?.medias && formData.medias[1]
          ? [
              {
                mediaId: [formData.medias[1]._id],
                type: "diploma-certification",
              },
            ]
          : [],
      isUpdate: false,
    },
    {
      name: "",
      placeholder: "Enhanced DBS Certificate (if working with minors)",
      isloading: false,
      documentID:
        formData?.medias && formData.medias[2]
          ? [
              {
                mediaId: [formData.medias[2]._id],
                type: "diploma-certification",
              },
            ]
          : [],
      isRequired: false,
      isUpdate: false,
    },
  ]);

  useEffect(() => {
    if (formData?.roles[0] === ROLE.THERAPIST) {
      setAvaibility(formData.availability.is24HoursAvailable ? "24" : "0");
      if (!formData.availability.is24HoursAvailable) {
        const map = formData.availability.availability.map((val) => {
          return {
            dayInString: val.dayInString,
            startDate: dayjs(`${day}T${val.startDate}`),
            endDate: dayjs(`${day}T${val.endDate}`),
          };
        });
        setAvaibilityTime(JSON.parse(JSON.stringify(map)));
      }
    }
  }, [formData?.roles, formData?.availability]);

  const isDisable =
    avaibility === "24"
      ? true
      : avaibilityTime.filter((data) => data.startDate === null && data.endDate === null).length === 0;

  useEffect(() => {
    const updatedDocs = docs.map((doc, index) => {
      if (formData?.medias && formData?.medias[index]) {
        return {
          ...doc,
          documentID: [
            {
              mediaId: [formData?.medias[index]._id],
              type: "diploma-certification",
            },
          ],
        };
      }

      return doc;
    });
    setDocs(updatedDocs);
  }, [formData]);

  useEffect(() => {
    setStatus(formData?.status);
  }, [formData?.status]);

  const onApprove = (status: boolean) => {
    setStatusLoading(true);
    updateStatus(formData?._id ?? "", status)
      .then((data: any) => {
        setStatus(data.data.status);
        setStatusLoading(false);
      })
      .catch((err) => {
        toast.error(err.response.data.message ?? "There is some issue with server. please try again later.");
        setStatusLoading(false);
      });
  };

  useEffect(() => {
    if (formData?.categories) {
      setCategories(formData.categories.map((val) => val._id));
    }
  }, [formData?.categories]);

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
        doc[index].isUpdate = true;

        doc[index].documentID = documents;
        setDocs(doc);
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message);
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

  const resendEmailVerification = () => {
    setEmailLoading(true);
    resendEmail(formData?._id ?? "")
      .then((data: any) => {
        setEmailLoading(false);
        toast.success(data.data.message ?? "Email sended successfully.");
      })
      .catch((err) => {
        setEmailLoading(false);
        toast.error(err.response.data.message ?? "There is some issue with server. please try again later.");
      });
  };

  const handleEndSession = async (sessionId: any) => {
    if (sessionId) {
      endSessoin(sessionId)
        .then(() => {
          toast.success("Therapist now available");
        })
        .catch((error) => {
          toast.error(error?.response?.data?.message);
        });
    }
  };

  const handleTopup = () => {
    setTopupLoading(true);
    postTopupAmount({
      secretToken: "therapist abc 123",
      userId: formData?._id,
      amount: topupAmount,
    })
      .then(() => {
        toast.success("Topup successful.");
        setTopupLoading(false);
      })
      .catch(() => {
        toast.success("Topup Failed.");
        setTopupLoading(false);
      });
  };

  return (
    <Grid container spacing={6}>
      {/* Account Details Card */}
      <Grid item xs={12}>
        <Paper>
          <CardHeader title="Account Details" sx={{ paddingBottom: "5px" }} />
          <form onSubmit={(e) => saveUserDetails(e, categories)}>
            <CardContent sx={{ pt: 0 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  "@media screen and (max-width: 767px)": {
                    alignItems: "flex-start",
                  },
                }}
              >
                <ImgStyled src={profilePic ? profilePic : imgSrc} alt="Profile Pic" />
                {session?.user.role !== ROLE.ADMIN && (
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        "@media screen and (max-width: 767px)": {
                          flexDirection: "column",
                        },
                      }}
                    >
                      <ButtonStyled component="label" variant="contained" htmlFor="account-settings-upload-image">
                        {isLoading ? <CircularProgress color="inherit" size={20} sx={{ mr: 2 }} /> : null} Upload New Photo
                        <input
                          hidden
                          type="file"
                          accept="image/png, image/jpeg"
                          onChange={handleInputImageSubmit}
                          id="account-settings-upload-image"
                        />
                      </ButtonStyled>
                      <ButtonStyled color="error" variant="outlined" onClick={handleReset}>
                        Reset
                      </ButtonStyled>
                    </Box>

                    <Typography sx={{ mt: 3, color: "text.disabled" }}>Allowed PNG or JPEG. Max size of 800K.</Typography>
                  </Box>
                )}
                {session?.user.role === ROLE.ADMIN && formData?.roles[0] !== ROLE.ADMIN && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      "@media screen and (max-width: 767px)": {
                        flexDirection: "column",
                      },
                    }}
                  >
                    {status === "pending" ? (
                      <>
                        <Button
                          sx={{ width: 120, height: 40 }}
                          variant="contained"
                          color={"primary"}
                          onClick={() => onApprove(true)}
                          disabled={statusLoading}
                        >
                          Approve
                        </Button>
                        <Button
                          sx={{ width: 120, height: 40 }}
                          variant="contained"
                          color={"error"}
                          onClick={() => {
                            setRejectModal(true);
                          }}
                          disabled={statusLoading}
                        >
                          Reject
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          sx={{ width: 120, height: 40 }}
                          variant="contained"
                          color={"primary"}
                          disabled={statusLoading}
                          onClick={() => onApprove(true)}
                        >
                          Active
                        </Button>
                        <Button
                          sx={{ width: 120, height: 40 }}
                          variant="contained"
                          color={"primary"}
                          disabled={statusLoading}
                          onClick={() => onApprove(false)}
                        >
                          De-active
                        </Button>
                      </>
                    )}
                    {session?.user.roles[0] === ROLE.ADMIN &&
                      formData?.roles[0] === ROLE.THERAPIST &&
                      formData?.isInSession && (
                        <ButtonStyled color="primary" variant="outlined" onClick={() => handleEndSession(formData?._id)}>
                          Mark as available
                        </ButtonStyled>
                      )}

                    {!formData?.emailVerified && (
                      <Button variant="outlined" onClick={resendEmailVerification}>
                        {emailLoading ? <CircularProgress size={20} /> : "Resend Email verification"}
                      </Button>
                    )}
                  </Box>
                )}
              </Box>
            </CardContent>
            <Divider />

            <CardContent>
              <Grid container spacing={6}>
                {formData?.roles[0] === ROLE.THERAPIST && (
                  <Grid item xs={12}>
                    <form>
                      <Box sx={{ mb: 4 }}>
                        <TextField
                          multiline
                          fullWidth
                          type="text"
                          placeholder="tell about yourself"
                          label="Bio"
                          value={formData ? formData.profile.bio : ""}
                          onChange={(e) => handleFormChange("bio", e.target.value)}
                        />
                      </Box>
                    </form>
                  </Grid>
                )}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    required
                    placeholder="John"
                    value={formData ? formData.firstName : ""}
                    onChange={(e) => handleFormChange("firstName", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    placeholder="Doe"
                    required
                    value={formData ? formData.lastName : ""}
                    onChange={(e) => handleFormChange("lastName", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="email"
                    label="Email"
                    required
                    placeholder="john.doe@example.com"
                    value={formData ? formData.email : ""}
                    onChange={(e) => handleFormChange("email", e.target.value)}
                    InputProps={{
                      readOnly: true,
                      disabled: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <PhoneInput
                    className={classes.phone_input}
                    placeholder="Enter phone number"
                    limitMaxLength={true}
                    rules={{
                      validate: (value: string) => isValidPhoneNumber(value),
                      required: true,
                    }}
                    numberInputProps={{ style: { border: "none" } }}
                    value={formData?.profile?.phoneNumber ? formData.profile.phoneNumber : ""}
                    onChange={(e: any) => handleFormChange("phoneNumber", e)}
                    disableCountryCode={true}
                  />
                </Grid>
                {formData?.roles[0] === ROLE.THERAPIST && (
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="VAT"
                      placeholder="VAT"
                      value={formData?.profile?.VATNumber ? formData.profile.VATNumber : ""}
                      onChange={(e) => handleFormChange("VATNumber", e.target.value)}
                    />
                  </Grid>
                )}
                {formData?.roles[0] === ROLE.THERAPIST && (
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Hourly rates"
                      placeholder="Hourly rates"
                      value={formData?.profile?.perHourCharge ? formData.profile.perHourCharge : ""}
                      onChange={(e) => handleFormChange("perHourCharge", e.target.value)}
                    />
                  </Grid>
                )}
                {formData?.roles[0] !== ROLE.ADMIN && (
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <ReactSelectCategory
                        role={formData?.roles[0]}
                        selectedCategories={categories}
                        setSelectedCategories={setCategories}
                      />
                    </Box>
                  </Grid>
                )}
                <Grid item xs={12} sm={6}>
                  <FormControl sx={{ justifyContent: "center" }}>
                    <FormLabel id="demo-row-radio-buttons-group-label">Gender</FormLabel>
                    <RadioGroup
                      row
                      aria-required
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                      value={formData?.gender ? formData.gender : ""}
                      onChange={(e) => handleFormChange("gender", e.target.value)}
                    >
                      <FormControlLabel value="Female" control={<Radio required />} label="Female" />
                      <FormControlLabel value="Male" control={<Radio required />} label="Male" />
                      <FormControlLabel value="Other" control={<Radio required />} label="Other" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" sx={{ mr: 3 }} type="submit">
                    Save Changes
                  </Button>
                  <Button type="reset" variant="outlined" color="secondary" onClick={handleReset}>
                    Reset
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </form>
        </Paper>
      </Grid>
      {session?.user.role == ROLE.THERAPIST && (
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Update Certificate" />
            <CardContent>
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

              <Button
                variant="contained"
                sx={{ mr: 3 }}
                onClick={() => {
                  const doc: any = [];
                  docs.map((val) => {
                    if (val.documentID.length > 0) {
                      doc.push(val.documentID[0]);
                    }

                    return val;
                  });

                  handleInputDocumentSubmit(doc);
                  setDocs([
                    {
                      name: "",
                      placeholder: "Accreditation/Registration",
                      isloading: false,
                      isRequired: true,
                      documentID: [],
                      isUpdate: false,
                    },
                    {
                      name: "",
                      placeholder: "Insurance Certificate",
                      isloading: false,
                      isRequired: true,
                      documentID: [],
                      isUpdate: false,
                    },
                    {
                      name: "",
                      placeholder: "Enhanced DBS Certificate (if working with minors)",
                      isloading: false,
                      documentID: [],
                      isRequired: false,
                      isUpdate: false,
                    },
                  ]);
                }}
              >
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </Grid>
      )}

      {formData?.roles[0] === ROLE.THERAPIST && (
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Certificates" />
            <Grid container spacing={4} m={5} gap={10}>
              {formData?.medias &&
                formData?.medias.map((val, index) => (
                  <ViewCertificate filepath={val.filepath} name={`${docName[index]}`} key={index} />
                ))}
            </Grid>
          </Card>
        </Grid>
      )}

      {formData && formData?.roles.length > 0 && formData?.roles[0] === ROLE.THERAPIST && (
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Update Questions" />
            <Grid container spacing={4} m={5} justifyContent={"space-between"}>
              <FormControl sx={{ mb: 3 }} fullWidth variant="outlined">
                <FormLabel id="avaibility-label">Availability</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="avaibility-label"
                  name="avaibility"
                  value={avaibility}
                  onChange={(e) => setAvaibility(e.target.value)}
                >
                  <FormControlLabel value="24" control={<Radio />} label="24 Hour Available" />
                  <FormControlLabel value="0" control={<Radio />} label="Choose Time" />
                </RadioGroup>
              </FormControl>
            </Grid>

            {avaibility === "0" && (
              <Grid container spacing={4} mb={5}>
                {avaibilityTime.map((val, index) => (
                  <Box
                    key={`avaibility-time-${index}`}
                    sx={{
                      display: "flex",
                      gap: 5,
                      alignItems: "center",
                      mb: 5,
                      ml: 10,
                    }}
                  >
                    <Box sx={{ minWidth: { sm: "10vw", xs: "20vw" } }}>
                      <Typography variant="h6">{val.dayInString}</Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 5,
                        flexDirection: { sm: "row", xs: "column" },
                      }}
                    >
                      <CustomTimePicker
                        label={"From"}
                        value={val.startDate}
                        onChange={(val) => {
                          const obj = JSON.parse(JSON.stringify(avaibilityTime));
                          obj[index].startDate = val?.format("HH:mm:ss").toString() ?? null;
                          setAvaibilityTime(obj);
                        }}
                      />
                      <CustomTimePicker
                        label="To"
                        value={val.endDate}
                        onChange={(val) => {
                          const obj = JSON.parse(JSON.stringify(avaibilityTime));
                          obj[index].endDate = val?.format("HH:mm:ss").toString() ?? null;
                          setAvaibilityTime(obj);
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Grid>
            )}
            <Button
              disabled={!isDisable}
              onClick={() => {
                saveUserAvaibilityDetail(avaibilityTime, avaibility === "24");
              }}
              variant="contained"
              sx={{ mb: 5, ml: 5 }}
            >
              Save Changes
            </Button>
          </Card>
        </Grid>
      )}

      {formData?.roles[0] === ROLE.USER && session?.user.role === ROLE.ADMIN && (
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Add Balance" />
            <CardContent>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="number"
                  label="Amount"
                  required
                  placeholder="£15"
                  value={topupAmount}
                  onChange={(e) => setTopupAmount(Number.parseFloat(e.target.value))}
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" sx={{ mt: 3 }} onClick={handleTopup} disabled={topupLoading}>
                  {topupLoading ? <CircularProgress /> : "Top up"}
                </Button>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      )}
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Close Account" />
          <CardContent>
            <Grid item xs={12}>
              <Button variant="contained" sx={{ mr: 3 }} onClick={handleCloseAccountOpen} color="error">
                Close Account
              </Button>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      {/* Close Account Dialogs */}
      <Dialog fullWidth maxWidth="xs" open={open} onClose={handleClose}>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                maxWidth: "85%",
                textAlign: "center",
                "& svg": { mb: 4, color: "warning.main" },
              }}
            >
              <Icon icon="mdi:alert-circle-outline" fontSize="5.5rem" />
              <Typography>Are you sure you would like to Close your account?</Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button variant="contained" onClick={() => handleConfirmation(true)} color="error">
            Yes
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => handleConfirmation(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog aria-labelledby="customized-dialog-title" open={rejectModal} maxWidth="sm" scroll="body" fullWidth>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                maxWidth: "85%",
                textAlign: "center",
                "& svg": { mb: 4, color: "warning.main" },
              }}
            >
              <Icon icon="mdi:alert-circle-outline" fontSize="5.5rem" />
              <Typography>Are you sure you would like to reject this Therapist?</Typography>
            </Box>
          </Box>
          <Box sx={{ mb: 4, mt: 4 }}>
            <TextField
              fullWidth
              type="text"
              label="Reason for reject"
              placeholder="Reason for reject"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            variant="contained"
            onClick={() => {
              if (reason) {
                if (formData?._id)
                  rejectTherapist({
                    rejectReason: reason,
                    therapistId: formData?._id,
                  })
                    .then(() => {
                      setRejectModal(false);
                      router.replace("/therapist");
                      toast.success("Therapist Rejected.");
                    })
                    .catch((err) => {
                      toast.error(err.response.data.message ?? "There is some issue with server. please try again later.");
                    });
              } else {
                toast.error("Please give a reason for reject");
              }
            }}
          >
            Yes
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => setRejectModal(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default TabAccount;
