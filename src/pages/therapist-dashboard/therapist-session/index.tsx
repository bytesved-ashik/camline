import { Typography, Button, CardContent, CardMedia, Fab, Grid, Paper, Stack, ListItemIcon } from "@mui/material";
import { Box } from "@mui/system";
import { Icon } from "@iconify/react";
import React, { useState } from "react";
import ChatSession from "src/views/pages/session/ChatSession";
import CustomBadge from "src/@core/components/mui/badge";
import SessionSettings from "src/components/ui/dialogs/SessionSettings";
import CustomDialog from "src/components/ui/dialogs/CustomDialog";
import ScheduleDialog from "src/components/ui/dialogs/ScheduleDialog";

const video = "../../video/myfile.mp4";

const TherapistSession = () => {
  const [open, setOpen] = useState(false);

  const [show, setShow] = useState(false);

  const [showDialog, setShowDialog] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickShow = () => {
    setShow(true);
  };

  const handleHide = () => {
    setShow(false);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  const handleShowDialog = () => {
    setShowDialog(true);
  };

  return (
    <>
      <Paper sx={{ mb: 4, padding: "20px" }}>
        <Grid container alignItems="center">
          <Grid item xs={4}>
            <Box component="div">
              <Box component="div" sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="body2" sx={{ color: "text.primary" }}>
                  {" "}
                  Query Status:
                </Typography>
                <Box component="div" sx={{ ml: 4, display: "inline-flex", alignItems: "center" }}>
                  <ListItemIcon sx={{ "& svg": { color: `primary.main` } }}>
                    <Icon icon="mdi:circle" fontSize="0.75rem" />
                  </ListItemIcon>
                  <Typography variant="body2" sx={{ color: "primary.main" }}>
                    {" "}
                    In-Discussion{" "}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box>
              <Typography
                component="p"
                variant="body2"
                sx={{ color: "text.primary", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                Time:
                <Typography component="span" sx={{ display: "inline-block", ml: 4, lineHeight: 0 }}>
                  <CustomBadge
                    skin="light"
                    color="primary"
                    badgeContent={"17:34"}
                    sx={{ display: "inline-block", ml: 4, lineHeight: 0 }}
                  ></CustomBadge>
                </Typography>
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4} sx={{ textAlign: "end" }}>
            <Button variant="outlined" color="secondary" sx={{ px: 1 }}>
              <Typography component="span" mr={2} lineHeight={0}>
                <Icon icon="la:user-friends" fontSize="1.4rem" />
              </Typography>
              2
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <Grid container spacing={6} alignItems="center">
        <Grid item xs={6} height="calc(100vh - 425px)">
          <Box sx={{ height: "100%", position: "relative" }}>
            <CardMedia
              component="video"
              src={video}
              height="100%"
              sx={{ objectFit: "cover", borderRadius: "20px", border: "15px solid color.primary" }}
            />
            <Fab color="primary" aria-label="add" size="small" sx={{ position: "absolute", top: "15px", right: "15px" }}>
              <Icon icon="ic:round-mic-off" />
            </Fab>

            <Typography
              component="div"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                backgroundColor: "secondary.main",
                padding: "3px 10px",
                borderRadius: "8px",
                position: "absolute",
                bottom: "15px",
                left: "15px",
              }}
            >
              <Typography variant="body2" sx={{ color: "#fff" }}>
                You
              </Typography>
              <Icon icon="material-symbols:wifi-2-bar" style={{ color: "#36B37E", marginLeft: "6px" }} />
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6} height="calc(100vh - 425px)">
          <Box sx={{ height: "100%", position: "relative" }}>
            <CardMedia component="video" height="100%" src={video} sx={{ objectFit: "cover", borderRadius: "20px" }} />
            <Typography
              component="div"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                backgroundColor: "secondary.main",
                padding: "3px 10px",
                borderRadius: "8px",
                position: "absolute",
                bottom: "15px",
                left: "15px",
              }}
            >
              <Typography variant="body2" sx={{ color: "#fff" }}>
                Karen A
              </Typography>
              <Icon icon="material-symbols:wifi-2-bar" style={{ color: "#36B37E", marginLeft: "6px" }} />
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <Paper sx={{ my: 4 }}>
        <CardContent sx={{ display: "flex" }}>
          <Box sx={{ flex: 1 }}>
            <Button
              variant="text"
              color="secondary"
              sx={{ padding: "15px 5px", minWidth: "48px", height: "48px", fontSize: "20px" }}
            >
              <Icon icon="ant-design:expand-outlined" />
            </Button>
            <Button
              onClick={handleClickShow}
              variant="text"
              color="secondary"
              sx={{ padding: "15px 5px", minWidth: "48px", height: "48px", fontSize: "20px" }}
            >
              <Icon icon="ep:setting" />
            </Button>
          </Box>
          <Box>
            <Stack sx={{ flexDirection: "row", justifyContent: "center" }}>
              <Button
                variant="contained"
                sx={{ padding: "15px 5px", minWidth: "48px", height: "48px", fontSize: "20px", margin: "0 8px" }}
              >
                <Icon icon="ic:round-mic-off" />
              </Button>
              <Button
                variant="text"
                color="secondary"
                sx={{ padding: "15px 5px", minWidth: "48px", height: "48px", fontSize: "20px", margin: "0 8px" }}
              >
                <Icon icon="humbleicons:camera-video-off" />
              </Button>
              <Button
                onClick={handleClickOpen}
                variant="contained"
                color="error"
                sx={{ height: "48px", margin: "0 8px" }}
                startIcon={<Icon icon="mdi:phone-hangup" />}
              >
                End Session
              </Button>
            </Stack>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Stack sx={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <Button
                variant="text"
                color="secondary"
                sx={{ padding: "15px 5px", minWidth: "48px", height: "48px", fontSize: "20px" }}
              >
                <Icon icon="mdi:hand-front-left" />
              </Button>

              <ChatSession />
              <Button
                onClick={handleShowDialog}
                variant="text"
                color="secondary"
                sx={{ padding: "15px 5px", minWidth: "48px", height: "48px", fontSize: "20px" }}
              >
                <Icon icon="ic:round-calendar-today" />
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Paper>
      <SessionSettings onClose={handleHide} show={show} />
      <CustomDialog
        onClose={handleClose}
        open={open}
        title="End Session"
        desc="The session will end for everyone and all the activities will stop. You can’t undo this action."
        btnText="End Session"
        action=" Don’t End"
        color="error"
      />
      <ScheduleDialog onCloseDialog={handleCloseDialog} showDialog={showDialog} />
    </>
  );
};

export default TherapistSession;
