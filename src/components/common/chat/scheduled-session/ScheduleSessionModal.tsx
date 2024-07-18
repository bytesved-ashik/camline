import { Avatar, Box, Button, Divider, Grid, IconButton, ListItem, Paper, Typography } from "@mui/material";
import React, { Dispatch, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useSessionData } from "@/store/sessionData/useSessionData";
import { dateFormatter, timeToDuration } from "@/utils/dateAndTimeUtility";
import * as toast from "@/utils/toast";
import { useCustomMutation } from "@/hooks/useCustomMutation";
import { sendChatMessage } from "@/services/chat.service";
import { scheduleSessionService } from "@/services/scheduleSessions.service";
import { IScheduleSessionRequest, ISession } from "@/types/interfaces/session.interface";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { DigitalClock, TimeField } from "@mui/x-date-pickers";
import { useGetProfilePic } from "@/hooks/profile/useGetProfilePic";
import { Icon } from "@iconify/react";

export default function ScheduleSessionModal({
  setScheduleSessionModal,
}: {
  setScheduleSessionModal: Dispatch<React.SetStateAction<boolean>>;
}) {
  const { sessionData, sessionId } = useSessionData();
  const { profilePic: patientProfilePic } = useGetProfilePic(sessionData?.attendees[0].user.id);
  const [date, setDate] = useState<Dayjs | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<Dayjs | null>(null);
  const [duration, setDuration] = useState<Dayjs | null>(null);

  const { mutate: sendMessage } = useCustomMutation({
    api: sendChatMessage,
  });

  const { mutate: scheduleSession } = useCustomMutation<IScheduleSessionRequest, ISession>({
    api: scheduleSessionService,
    success: "Schedule request has been sent to the user",
    error: "Error",
    onSuccess: (res) => {
      sendMessage({
        messageType: "session",
        message: res._id,
        chatSessionId: sessionId,
        session: res._id,
        key: "uniqueKey",
      });
      setSessionStartTime(null);
      setDuration(null);
      setScheduleSessionModal(false);
    },
  });

  const handleAccept = () => {
    if (!sessionStartTime || !duration || !date) return toast.error("Please select date and duration");
    const newTime: Dayjs = dayjs()
      .set("date", date.get("date"))
      .set("months", date.get("months"))
      .set("years", date.get("years"))
      .set("hours", sessionStartTime.get("hours"))
      .set("minutes", sessionStartTime.get("minutes"))
      .set("seconds", sessionStartTime.get("seconds"))
      .set("milliseconds", sessionStartTime.get("milliseconds"));

    const scheduleSessionData: IScheduleSessionRequest = {
      duration: timeToDuration(duration),

      sessionStartTime: dateFormatter(dayjs(newTime.toDate())),
      id: sessionId,
    };
    scheduleSession(scheduleSessionData);
  };

  return (
    <Grid
      container
      columnSpacing={8}
      sx={{
        bgcolor: "#ffffff",
        borderRadius: "20px",

        height: "max-content",
        paddingX: "3%",
      }}
      direction="row"
      justifyContent="center"
      alignItems="center"
    >
      <IconButton
        aria-label="close"
        onClick={() => setScheduleSessionModal(false)}
        sx={{ top: 10, right: 10, position: "absolute", color: "grey.500" }}
      >
        <Icon icon="clarity:close-line" />
      </IconButton>
      <Grid xs={12}>
        <Typography variant="h4" textAlign={"center"} mt={10} sx={{ color: "#111013" }}>
          Create a schedule
        </Typography>
        <Typography variant="h6" textAlign={"center"} sx={{ color: "#878894", marginBottom: { xs: 3, lg: 10 } }}>
          Use this form to create a schedule for the patient
        </Typography>
      </Grid>
      <Grid item xs={12} mb={10}>
        <Paper
          elevation={4}
          sx={{
            display: "flex",
            alignItems: "center",
            padding: "20px",
            gap: "20px",
          }}
        >
          <Avatar sx={{ width: 60, height: 60 }} alt={sessionData?.attendees[0].user.name} src={patientProfilePic} />
          <Box>
            <Typography variant="h6" mb={0} sx={{ color: "#111013" }}>
              {sessionData?.attendees[0].user.name}
            </Typography>
            <Typography sx={{ color: "#546fff" }}>Patient</Typography>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} lg={6}>
        <Paper elevation={4} sx={{ display: "flex" }}>
          <Box>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <ListItem>
                <DateCalendar
                  minDate={dayjs()}
                  value={date}
                  onChange={(newValue) => {
                    setDate(newValue);
                  }}
                />
              </ListItem>
            </LocalizationProvider>
          </Box>
          <Box>
            <Divider orientation="vertical" />
          </Box>
          <Box>
            <Typography variant="h6" textAlign={"center"} my={5} sx={{ color: "#111013" }}>
              Pick Slot
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DigitalClock value={sessionStartTime} onChange={(newValue) => setSessionStartTime(newValue)} />
            </LocalizationProvider>
          </Box>
        </Paper>
        <Box sx={{ marginTop: "20px" }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimeField
              color="primary"
              sx={{ width: "100%" }}
              label={["Slot durations in minutes"]}
              value={duration}
              maxTime={dayjs().add(1, "day")}
              format="HH:mm"
              onChange={(newValue: Dayjs | null) => setDuration(newValue)}
            />
          </LocalizationProvider>
        </Box>
      </Grid>
      <Grid item xs={12} lg={6}>
        <Paper elevation={0} sx={{ padding: 4 }}>
          <Typography variant="h6" textAlign={"left"} my={5} sx={{ color: "#111013" }}>
            Fee Details
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography mb={2} sx={{ color: "#9495a2", fontSize: "1.2rem" }}>
              Session charges:
            </Typography>
            <Typography mb={2} sx={{ color: "#9495a2", fontSize: "1.2rem" }}>
              GBP250
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography mb={2} sx={{ color: "#9495a2", fontSize: "1.2rem" }}>
              Platform fees:
            </Typography>
            <Typography mb={2} sx={{ color: "#9495a2", fontSize: "1.2rem" }}>
              3%
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography mb={2} sx={{ color: "#9495a2", fontSize: "1.2rem" }}>
              Misc:
            </Typography>
            <Typography mb={2} sx={{ color: "#9495a2", fontSize: "1.2rem" }}>
              GBP10
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography mb={2} sx={{ color: "#9495a2", fontSize: "1.2rem" }}>
              Other deduction:
            </Typography>
            <Typography mb={2} sx={{ color: "#9495a2", fontSize: "1.2rem" }}>
              GBP3
            </Typography>
          </Box>

          <Divider />

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography mb={2} sx={{ color: "#9495a2", fontSize: "1.2rem" }}>
              Discount:
            </Typography>
            <Typography mb={2} sx={{ color: "#9495a2", fontSize: "1.2rem" }}>
              N/A
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography mb={2} sx={{ color: "#9495a2", fontSize: "1.2rem" }}>
              Taxes:
            </Typography>
            <Typography mb={2} sx={{ color: "#9495a2", fontSize: "1.2rem" }}>
              N/A
            </Typography>
          </Box>
        </Paper>

        <Box borderRadius={1} sx={{ bgcolor: "#ededff", padding: "3%", marginY: { sx: 6, lg: 12 } }}>
          <Typography mb={1} sx={{ color: "#7187ff" }}>
            You will be paid
          </Typography>
          <Typography variant="h6" mb={0} sx={{ color: "#546fff" }}>
            GBP229.89
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Button variant="contained" onClick={() => handleAccept()} sx={{ m: 8, width: 140, py: 3 }}>
          Submit
        </Button>
        <Button
          variant="outlined"
          sx={{ m: 8, color: "#6d788d", width: 140, py: 3 }}
          onClick={() => setScheduleSessionModal(false)}
        >
          Cancel
        </Button>
      </Grid>
    </Grid>
  );
}
