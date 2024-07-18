// ** MUI Imports
import { Box, Button, CardActions, CardContent } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** Third Party Components
import toast from "react-hot-toast";
import { QueryAccepted } from "@/types/interfaces/queryAccepted.interface";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useCustomMutation } from "@/hooks/useCustomMutation";
import { acceptScheduledSession } from "@/services/scheduleSessions.service";
import moment from "moment";
import { rejectSession } from "@/services/sessions.service";
import { SESSION_STATUS } from "@/enums/sessionStatus.enums";
import { QueryKeyString } from "@/enums/queryKey.enums";
import { useQueryClient } from "react-query";

const ScheduledSessionNotification = ({
  scheduledSessionData,
  setShowScheduleDialogue,
}: {
  scheduledSessionData: QueryAccepted;
  setShowScheduleDialogue: Dispatch<SetStateAction<boolean>>;
}) => {
  const queryClient = useQueryClient();

  const { mutate: acceptSessionRequest } = useCustomMutation({
    api: acceptScheduledSession,
    success: "The session has been accepted",
    error: "Error",
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeyString.CHAT_MESSAGE_DATA]);
      setShowScheduleDialogue(false);
    },
  });

  const { mutate: rejectSessionRequest } = useCustomMutation({
    api: rejectSession,
    success: "The session has been rejected",
    error: "Error",
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeyString.CHAT_MESSAGE_DATA]);
      setShowScheduleDialogue(false);
    },
  });
  const getScheduleDispayInfo = (requestStatus: string) => {
    switch (requestStatus) {
      case SESSION_STATUS.ACCEPTED:
        return { header: "The scheuled session has been accepted", status: "accepted", color: "#72E128" };
      case SESSION_STATUS.PENDING:
        return { header: "You have received a Session Schedule", status: "scheduled", color: "primary.main" };
      case SESSION_STATUS.REJECTED:
        return { header: "The scheuled session has been rejected", status: "rejected", color: "#FF4D49" };
      default:
        return { header: "You have received a Session Schedule", status: "scheduled", color: "primary.main" };
    }
  };
  useEffect(() => {
    const handleClose = () => {
      toast.dismiss();
    };
    const SessionScheduledDialogue = toast(
      <>
        <CardContent sx={{ padding: "8px !important", width: "100%" }}>
          <Typography variant="body1" sx={{ color: "text.primary", fontWeight: "600" }}>
            {getScheduleDispayInfo(scheduledSessionData.sessionStatus).header}
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", mb: 2 }}>
            {scheduledSessionData.sessionStatus === SESSION_STATUS.PENDING ? scheduledSessionData.therapist.name : "User"}{" "}
            {getScheduleDispayInfo(scheduledSessionData.sessionStatus).status} the therapy session for
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1, width: "100%" }}>
            <Box component="span" sx={{ lineHeight: 1, color: "primary.main" }}>
              <Icon icon="material-symbols:calendar-today-rounded" fontSize="1.5rem" />
            </Box>
            <Box className="media-body" sx={{ flex: "1" }}>
              <Typography variant="subtitle1" sx={{ color: "text.primary", marginLeft: "8px" }}>
                {moment(scheduledSessionData.sessionStartTime).format("Do MMMM YYYY - h:mm a")}
              </Typography>
            </Box>
          </Box>
          <Typography
            variant="body1"
            sx={{
              color: getScheduleDispayInfo(scheduledSessionData.sessionStatus).color,
              textTransform: "capitalize",
            }}
          >
            Session {getScheduleDispayInfo(scheduledSessionData.sessionStatus).status}
          </Typography>
          <Box component="div" sx={{ display: "flex", margin: "5px -8px" }}>
            <Box component="div" sx={{ padding: "0 8px", flex: 1 }}>
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                Price:
              </Typography>
            </Box>
            <Box component="div" sx={{ padding: "0 8px", flex: 1 }}>
              <Typography variant="body1" sx={{ color: "text.secondary", fontWeight: "700" }}>
                £40
              </Typography>
            </Box>
          </Box>
          <Box component="div" sx={{ display: "flex", margin: "5px -8px" }}>
            <Box component="div" sx={{ padding: "0 8px", flex: 1 }}>
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                Session time:
              </Typography>
            </Box>
            <Box component="div" sx={{ padding: "0 8px", flex: 1 }}>
              <Typography variant="body1" sx={{ color: "text.secondary", fontWeight: "700" }}>
                {scheduledSessionData.duration} mins
              </Typography>
            </Box>
          </Box>
          <Box component="div" sx={{ display: "flex", margin: "5px -8px" }}>
            <Box component="div" sx={{ padding: "0 8px", flex: 1 }}>
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                Status:
              </Typography>
            </Box>
            <Box component="div" sx={{ padding: "0 8px", flex: 1 }}>
              <Typography
                variant="body1"
                sx={{
                  color: getScheduleDispayInfo(scheduledSessionData.sessionStatus).color,
                  fontWeight: "700",
                  textTransform: "capitalize",
                }}
              >
                {scheduledSessionData.sessionStatus}
              </Typography>
            </Box>
          </Box>
          {scheduledSessionData.sessionStatus === SESSION_STATUS.PENDING ? (
            <CardActions sx={{ px: 0, pb: 0 }}>
              <Button color="primary" variant="contained" onClick={() => acceptSessionRequest(scheduledSessionData._id)}>
                Accept
              </Button>

              <Button color="primary" variant="outlined" onClick={() => rejectSessionRequest(scheduledSessionData._id)}>
                Reject
              </Button>
            </CardActions>
          ) : null}
        </CardContent>
        <IconButton onClick={handleClose} sx={{ position: "absolute", right: "10px" }}>
          <Icon icon="mdi:close" fontSize={20} />
        </IconButton>
      </>,
      {
        position: "bottom-left",
        duration: Infinity,
        style: {
          maxWidth: "560px",
          width: "100%",
          padding: "0 !important",
        },
      }
    );

    return () => {
      toast.dismiss(SessionScheduledDialogue);
    };
  }, [scheduledSessionData._id]);

  return null;
};

export default ScheduledSessionNotification;
