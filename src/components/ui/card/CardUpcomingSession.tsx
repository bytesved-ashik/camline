import { Button, Card, CardContent, CardHeader, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import AvatarWithBadge from "../avatar/AvatarWithBadge";
import moment from "moment";
import { Icon } from "@iconify/react";
import { UpcomingSessionData } from "@/types/interfaces/upcomingSession.interface";
import { getSessions } from "@/services/sessions.service";
import { useRouter } from "next/router";

const params = {
  sort: "sessionStartTime:asc",
  limit: 1,
  page: 1,
  pagination: false,
  sessionType: "private",
  sessionStatus: "accepted",
};
const CardUpcomingSession = () => {
  const [upcomingSession, setUpcomingSession] = useState<UpcomingSessionData>();
  const router = useRouter();

  useEffect(() => {
    getSessions(params).then((res) => {
      if (res.docs.length !== 0) setUpcomingSession(res.docs[0]);
    });
  }, []);

  // TODO: to implemet upcomming api when created
  const joinButton = moment().isSameOrAfter(upcomingSession?.sessionStartTime);

  return (
    <Card
      sx={{
        height: {
          xs: "200px",
          md: "280px",
          lg: "100%",
          xl: "400px",
        },
        position: "relative",
      }}
    >
      <CardHeader title="Upcoming Session" sx={{ borderBottom: "2px solid #eaeaec" }} />

      <CardContent sx={{ mt: 6 }}>
        {upcomingSession?.therapist ? (
          <Box>
            <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
              <AvatarWithBadge image="" />
              <Box
                sx={{
                  mx: 4,
                  flex: "1 1",
                  display: "flex",
                  overflow: "hidden",
                  flexDirection: "column",
                }}
              >
                <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 600, color: "text.primary" }}>
                  {upcomingSession?.therapist?.name ? upcomingSession?.therapist?.name : null}
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                pt: 4,
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <Box sx={{ flex: 1, textAlign: "left" }}>
                <Typography variant="subtitle1" sx={{ fontWeight: "700" }}>
                  {" "}
                  Start Date:
                  <Typography component={"span"} variant="body2" sx={{ fontWeight: "400", fontSize: "1rem" }}>
                    {upcomingSession?.sessionStartTime
                      ? moment(upcomingSession.sessionStartTime).format("MMMM Do YYYY")
                      : null}{" "}
                  </Typography>
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: "700" }}>
                  Time:{" "}
                  <Typography component={"span"} variant="body2" sx={{ fontWeight: "400", fontSize: "1rem" }}>
                    {upcomingSession?.sessionStartTime ? moment(upcomingSession.sessionStartTime).format("hh:mm a") : null}{" "}
                  </Typography>
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: "700" }}>
                  Duration:{" "}
                  <Typography component={"span"} variant="body2" sx={{ fontWeight: "400", fontSize: "1rem" }}>
                    {upcomingSession?.duration
                      ? `${moment
                          .utc(moment.duration(upcomingSession.duration * 60, "seconds").asMilliseconds())
                          .format("HH:mm")} hr`
                      : ""}
                  </Typography>
                </Typography>
                {joinButton && (
                  <Button
                    variant="contained"
                    sx={{ marginTop: 2 }}
                    onClick={() => {
                      router.push({
                        pathname: `/session/${upcomingSession?._id}`,
                      });
                    }}
                  >
                    Join Now
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              mt: 6,
              display: "flex",
              alignContent: "center",
              justifyContent: "center",
              position: "absolute",
              top: "50%",
              left: { xs: "47%", sm: "50%" },
              transform: "translate(-50%, -50%)",
              "& svg": { mr: 2 },
            }}
          >
            <Icon icon="mdi:alert-circle-outline" fontSize={20} />
            <Typography>No Upcoming Session</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default CardUpcomingSession;
