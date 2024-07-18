import { SESSION_STATUS } from "@/enums/sessionStatus.enums";
import { useCustomMutation } from "@/hooks/useCustomMutation";
import { acceptScheduledSession } from "@/services/scheduleSessions.service";
import { rejectSession } from "@/services/sessions.service";
import { ChatLogChatType } from "@/types/apps/chatTypes";
import { Icon } from "@iconify/react";
import { Box, Button, Card, CardContent, Skeleton, Typography } from "@mui/material";
import moment from "moment";
import { QueryKeyString } from "@/enums/queryKey.enums";
import { useQueryClient } from "react-query";
import { Dispatch, SetStateAction } from "react";

const ScheduleSession = ({
  scheduleSessionData,
  isSender,
  setShowScheduleDialogue,
}: {
  scheduleSessionData: ChatLogChatType;
  isSender: boolean;
  setShowScheduleDialogue: Dispatch<SetStateAction<boolean>>;
}) => {
  const queryClient = useQueryClient();
  const scheduleSession = scheduleSessionData.session;

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
        return { status: "accepted", color: "#72E128" };
      case SESSION_STATUS.PENDING:
        return { status: "scheduled", color: "primary.main" };
      case SESSION_STATUS.REJECTED:
        return { status: "rejected", color: "#FF4D49" };
      default:
        return { status: "scheduled", color: "primary.main" };
    }
  };
  if (Object.keys(scheduleSession).length === 0)
    return (
      <>
        <Card>
          <CardContent>
            <Skeleton variant="text" width="250px" height="40px" />
            <Skeleton variant="rounded" width="100%" height="120px" />
          </CardContent>
        </Card>
      </>
    );

  return (
    <>
      <Card>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Box component="span" sx={{ lineHeight: 1, color: "primary.main" }}>
              <Icon icon="material-symbols:calendar-today-rounded" fontSize="1.5rem" />
            </Box>
            <Box className="media-body" sx={{ flex: "1" }}>
              <Typography variant="subtitle1" sx={{ color: "text.primary", marginLeft: "8px" }}>
                {moment(scheduleSession?.sessionStartTime).format("Do MMMM YYYY - h:mm a")}{" "}
              </Typography>
            </Box>
          </Box>
          <Typography
            variant="body1"
            sx={{
              color: getScheduleDispayInfo(scheduleSession.sessionStatus).color,
              textTransform: "capitalize",
            }}
          >
            Session {getScheduleDispayInfo(scheduleSession.sessionStatus).status}
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
                {scheduleSession?.duration} mins
              </Typography>
            </Box>
          </Box>
          {scheduleSession.sessionStatus === SESSION_STATUS.PENDING ? (
            <>
              {!isSender ? (
                <Box
                  component="div"
                  sx={{ display: "flex", padding: 3, margin: "5px -8px", justifyContent: "space-between" }}
                >
                  <Button variant="contained" onClick={() => acceptSessionRequest(scheduleSessionData.msg)}>
                    Accept
                  </Button>
                  <Button variant="outlined" onClick={() => rejectSessionRequest(scheduleSessionData.msg)}>
                    Decline
                  </Button>
                </Box>
              ) : (
                <Typography component="p" variant="caption" sx={{ color: "text.secondary" }}>
                  The scheduled session request is sent.
                </Typography>
              )}
            </>
          ) : (
            <Box component="div" sx={{ mt: 2 }}>
              <Typography component="p" variant="caption" sx={{ color: "text.secondary" }}>
                The Scheduled session is{" "}
                <Typography
                  component="span"
                  variant="caption"
                  sx={{ color: getScheduleDispayInfo(scheduleSession.sessionStatus).color }}
                >
                  {scheduleSession?.sessionStatus}
                </Typography>
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
      <Typography variant="caption" sx={{ color: "text.disabled" }}>
        {moment(scheduleSession?.createdAt).format("h:mm a")}
      </Typography>
    </>
  );
};

export default ScheduleSession;
