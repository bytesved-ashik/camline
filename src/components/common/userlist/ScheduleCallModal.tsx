import { Icon } from "@iconify/react";
import { Box, Button, Dialog, DialogContent, Grid, IconButton, TextField, Typography } from "@mui/material";
import { Ref, forwardRef, ReactElement, useState, useEffect, memo } from "react";
import Fade, { FadeProps } from "@mui/material/Fade";
import { LocalizationProvider, TimeField } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { upcomingSession, upcomingTherapistScheduleSession } from "@/services/session.service";
import toast from "react-hot-toast";

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />;
});

const toastOptions: any = {
  position: "top-left",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  zIndex: 99999,
};

const ScheduleCallModal = (props: any) => {
  const [value, setValue] = useState<Dayjs | null>(dayjs("2022-04-17"));
  const [startTime, setStartTime] = useState<Dayjs | null>(dayjs("2022-04-17"));
  const [endTime, setEndTime] = useState<Dayjs | null>(dayjs("2022-04-17"));
  const [minutes, setMinutes] = useState<number>(0);
  const [fullDate, setFullDate] = useState<string>("");

  useEffect(() => {
    const todayDate: Dayjs = dayjs();
    setValue(todayDate);
    setStartTime(todayDate);
    setEndTime(todayDate);
  }, []);

  useEffect(() => {
    const startTimeFormatted = startTime && startTime.format("HH:mm");
    const endTimeFormatted = endTime && endTime.format("HH:mm");
    const startTimeParsed = dayjs(startTimeFormatted, "HH:mm");
    const endTimeParsed = dayjs(endTimeFormatted, "HH:mm");
    const diffMinutes = endTimeParsed.diff(startTimeParsed, "minutes");
    setMinutes(diffMinutes);
  }, [startTime, endTime]);

  useEffect(() => {
    const fullTime = startTime && startTime.format("HH:mm:ss");
    const concatenatedString = fullTime + ".00";
    const concatenatedDate = value && value + "T";
    const concateDateTime = concatenatedDate + concatenatedString;
    setFullDate(concateDateTime);
  }, [value, startTime, endTime]);

  const generateRandomNumberAndString = () => {
    const randomNumber = Math.floor(1000000000 + Math.random() * 9000000000);
    const randomString = Math.random().toString(36).substring(2, 12);
    const mixedValue = randomNumber.toString() + randomString;

    return mixedValue;
  };

  const scheduleMeeting = () => {
    if (minutes > 1 && minutes <= 60) {
      const payload = {
        therapistId: props?.therapistId,
        startDate: fullDate,
        duration: minutes,
      };

      const mixedValue = generateRandomNumberAndString();

      const therapistPayload = {
        userId: props?.therapistId,
        startDate: fullDate,
        duration: minutes,
        streamId: mixedValue,
      };
      if (props?.therapistCall) {
        upcomingTherapistScheduleSession(therapistPayload)
          .then(() => {
            toast.success("Your appointment is successfully booked.", toastOptions);
            props.closeDialog();
          })
          .catch((error: any) => {
            toast.error(error?.response?.data?.message, toastOptions);
            props.closeDialog();
          });
      } else {
        upcomingSession(payload)
          .then(() => {
            toast.success("Your appointment is successfully booked.", toastOptions);
            props.closeDialog();
          })
          .catch((error: any) => {
            toast.error(error?.response?.data?.message, toastOptions);
            props.closeDialog();
          });
      }
    } else if (minutes > 60) {
      toast.error("Enter minumum one hour call", toastOptions);
    } else {
      toast.error("Enter Correct Date&Time", toastOptions);
    }
  };

  const handleClose = () => {
    props.closeDialog();
  };

  return (
    <>
      <Dialog
        open={props.showDialog}
        maxWidth="md"
        scroll="body"
        onClose={handleClose}
        TransitionComponent={Transition}
        onBackdropClick={handleClose}
        sx={{ zIndex: 9999 }}
      >
        <DialogContent
          sx={{
            px: { xs: 8, sm: 15 },
            py: { xs: 8, sm: 12.5 },
            position: "relative",
          }}
        >
          <IconButton size="small" onClick={props.closeDialog} sx={{ position: "absolute", right: "1rem", top: "1rem" }}>
            <Icon icon="mdi:close" />
          </IconButton>
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography variant="h5" sx={{ mb: 3, lineHeight: "2rem" }}>
              Schedule a Call
            </Typography>
          </Box>
          <Grid direction="column" container spacing={6}>
            <Grid item xs={8} sx={{ marginTop: "20px" }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TextField
                  required
                  id="outlined-required"
                  defaultValue="Hello World"
                  variant="outlined"
                  type="date"
                  value={value}
                  onChange={(e: any) => setValue(e?.target?.value)}
                  sx={{
                    width: "100%",
                    "@media (max-width: 768px)": {
                      width: "100%",
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid
              item
              xs={8}
              sx={{
                // marginTop: "20px",
                "@media (max-width: 768px)": {
                  width: "100%",
                },
              }}
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimeField
                  label="Start Time"
                  value={startTime}
                  format="HH:mm"
                  onChange={(newValue) => setStartTime(newValue)}
                  sx={{
                    "@media (max-width: 768px)": {
                      width: "100%",
                      marginTop: "15px",
                      marginLeft: "0px",
                    },
                  }}
                />
              </LocalizationProvider>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimeField
                  label="End Date"
                  defaultValue={dayjs("2022-04-17T15:30")}
                  format="HH:mm"
                  value={endTime}
                  onChange={(newValue) => setEndTime(newValue)}
                  sx={{
                    marginLeft: "20px",
                    "@media (max-width: 768px)": {
                      width: "100%",
                      marginTop: "15px",
                      marginLeft: "0px",
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>

          <Button
            sx={{ width: "100%", height: 40, marginTop: "15px" }}
            variant="contained"
            color="primary"
            onClick={scheduleMeeting}
          >
            Schedule Call
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default memo(ScheduleCallModal);
