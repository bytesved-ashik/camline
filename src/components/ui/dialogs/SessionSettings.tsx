import { Icon } from "@iconify/react";
import {
  List,
  DialogContent,
  Dialog,
  DialogTitle,
  Grid,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  FormControl,
  Select,
  MenuItem,
  FormLabel,
  Typography,
  DialogActions,
  Button,
} from "@mui/material";

import Fade, { FadeProps } from "@mui/material/Fade";

import useBgColor from "src/@core/hooks/useBgColor";
import React, { useEffect, useState } from "react";

const Transition = React.forwardRef(function Transition(
  props: FadeProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Fade ref={ref} {...props} />;
});

const SessionSettings = (props: any) => {
  const bgColors = useBgColor();
  const videoElementRef = props.videoRef;
  const [videoType, setVideoType] = useState<MediaDeviceInfo>();
  const [audioInput, setAudioInput] = useState<MediaDeviceInfo>();
  const [audioOutput, setAudioOutput] = useState<MediaDeviceInfo>();
  const [audioInputSource, setAudioInputSource] = useState<MediaDeviceInfo[]>([]);
  const [audioOutputSource, setAudioOutputSource] = useState<MediaDeviceInfo[]>([]);
  const [videoSource, setVideoSource] = useState<MediaDeviceInfo[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const getDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      gotDevices(devices);
    } catch (error) {
      handleError(error);
    }
  };
  const gotDevices = (deviceInfos: MediaDeviceInfo[]) => {
    const audioInputDevices = deviceInfos.filter((device) => device.kind === "audioinput");
    const audioOutputDevices = deviceInfos.filter((device) => device.kind === "audiooutput");
    const videoDevices = deviceInfos.filter((device) => device.kind === "videoinput");

    setAudioInputSource(audioInputDevices);
    setAudioOutputSource(audioOutputDevices);
    setVideoSource(videoDevices);

    // Set default device selections
    if (audioInputDevices.length > 0 && audioInput === undefined) {
      setAudioInput(audioInputDevices[0]);
    }
    if (audioOutputDevices.length > 0 && audioOutput === undefined) {
      setAudioOutput(audioOutputDevices[0]);
    }
    if (videoDevices.length > 0 && videoType === undefined) {
      setVideoType(videoDevices[0]);
    }
  };

  const attachSinkId = (element: any, sinkId: any) => {
    if (typeof element.sinkId !== "undefined") {
      element
        .setSinkId(sinkId.deviceId)
        .then(() => {
          console.log(`Success, audio output device attached: ${sinkId.deviceId}`);
        })
        .catch(() => {
          // let errorMessage = error;
          // if (error.name === "SecurityError") {
          //   errorMessage = `You need to use HTTPS for selecting audio output device: ${error}`;
          // }

          // Jump back to the first output device in the list as it's the default.
          if (audioOutput) {
            setAudioOutput(audioOutputSource[0]);
          }
        });
    } else {
      console.warn("Browser does not support output device selection.");
    }
  };

  const changeAudioDestination = (audioDevice: MediaDeviceInfo) => {
    attachSinkId(videoElementRef.current!, audioDevice);
  };

  const gotStream = (stream: MediaStream) => {
    setStream(stream);
    videoElementRef.current!.srcObject = stream;

    // Refresh button list in case labels have become available
    getDevices();
  };

  const handleError = (error: any) => {
    console.log("navigator.MediaDevices.getUserMedia error: ", error.message, error.name);
  };

  const start = async (audioDevice?: MediaDeviceInfo, videoDevice?: MediaDeviceInfo) => {
    if (stream) {
      stream.getTracks().forEach((track: any) => {
        track.stop();
      });
    }
    const constraints = {
      audio: {
        deviceId: audioDevice ? { exact: audioDevice.deviceId } : undefined,
      },
      video: {
        deviceId: videoDevice ? { exact: videoDevice.deviceId } : undefined,
      },
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(stream);
      gotStream(stream);
    } catch (error) {
      handleError(error);
    }
  };

  const handleSubmit = () => {
    start(audioInput, videoType);
    if (audioOutput) {
      changeAudioDestination(audioOutput);
    }

    getDevices();
    props.onClose();
  };

  useEffect(() => {
    getDevices();
  }, []);

  return (
    <Dialog fullWidth maxWidth="md" scroll="body" TransitionComponent={Transition} onClose={props.onClose} open={props.show}>
      <DialogContent sx={{ position: "relative", p: 0 }}>
        <Grid container>
          <Grid item sm={4} xs={12}>
            <Box
              sx={{
                background: bgColors.secondaryLight.backgroundColor,
                height: "100%",
              }}
            >
              <DialogTitle>{"Settings"}</DialogTitle>
              <DialogContent>
                <List component="nav" aria-label="main mailbox">
                  <ListItem disablePadding>
                    <ListItemButton href="#">
                      <ListItemIcon sx={{ color: "text.primary" }}>
                        <Icon icon="ep:setting" fontSize={20} />
                      </ListItemIcon>
                      <ListItemText primary="Device Settings" sx={{ color: "text.primary" }} />
                    </ListItemButton>
                  </ListItem>
                </List>
              </DialogContent>
            </Box>
          </Grid>
          <Grid item sm={8} xs={12}>
            <DialogTitle>{"Device Settings"}</DialogTitle>
            <DialogContent>
              <Divider sx={{ mb: "16px !important" }} />
              <Box component="div" sx={{ mb: 6 }}>
                <FormLabel sx={{ mb: 1, display: "block" }}>Video</FormLabel>
                <FormControl
                  sx={{
                    background: bgColors.secondaryLight.backgroundColor,
                    border: "none !important",
                    position: "relative",
                  }}
                  fullWidth
                >
                  <Select
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                    value={videoType?.deviceId}
                    onChange={(event) => {
                      const videoDevice = videoSource.find((device) => device.deviceId === event.target.value);
                      setVideoType(videoDevice);
                    }}
                    sx={{
                      paddingLeft: "40px",
                      boxShadow: "none",
                      ".MuiOutlinedInput-notchedOutline": { border: 0 },
                    }}
                  >
                    {videoSource &&
                      videoSource.map((device) => (
                        <MenuItem key={device.deviceId} value={device.deviceId}>
                          {device.label || `camera ${device.deviceId}`}
                        </MenuItem>
                      ))}
                  </Select>
                  <Typography
                    component="span"
                    sx={{
                      position: "absolute",
                      top: "56%",
                      transform: "translate(0,-50%)",
                      left: "19px",
                    }}
                  >
                    <Icon icon="ph:video-camera" fontSize={20} />
                  </Typography>
                </FormControl>
              </Box>

              <Box component="div" sx={{ mb: 6 }}>
                <FormLabel sx={{ mb: 1, display: "block" }}>Microphone</FormLabel>
                <FormControl
                  sx={{
                    background: bgColors.secondaryLight.backgroundColor,
                    border: "none !important",
                    position: "relative",
                  }}
                  fullWidth
                >
                  <Select
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                    sx={{
                      paddingLeft: "40px",
                      boxShadow: "none",
                      ".MuiOutlinedInput-notchedOutline": { border: 0 },
                    }}
                    value={audioInput?.deviceId}
                    onChange={(event) => {
                      const audioDevice = audioInputSource.find((device) => device.deviceId === event.target.value);
                      setAudioInput(audioDevice);
                    }}
                  >
                    {audioInputSource &&
                      audioInputSource.map((device) => (
                        <MenuItem key={device.deviceId} value={device.deviceId}>
                          {device.label || `microphone ${device.deviceId}`}
                        </MenuItem>
                      ))}
                  </Select>
                  <Typography
                    component="span"
                    sx={{
                      position: "absolute",
                      top: "56%",
                      transform: "translate(0,-50%)",
                      left: "19px",
                    }}
                  >
                    <Icon icon="material-symbols:mic-outline-rounded" fontSize={20} />{" "}
                  </Typography>
                </FormControl>
              </Box>

              <Box component="div" sx={{ mb: 6 }}>
                <FormLabel sx={{ mb: 1, display: "block" }}>Speakers</FormLabel>
                <FormControl
                  sx={{
                    background: bgColors.secondaryLight.backgroundColor,
                    border: "none !important",
                    position: "relative",
                  }}
                  fullWidth
                >
                  <Select
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                    sx={{
                      paddingLeft: "40px",
                      boxShadow: "none",
                      ".MuiOutlinedInput-notchedOutline": { border: 0 },
                    }}
                    value={audioOutput?.deviceId}
                    onChange={(event) => {
                      const selectedDevice = audioOutputSource.find((device) => device.deviceId === event.target.value);
                      setAudioOutput(selectedDevice);
                    }}
                  >
                    {audioOutputSource &&
                      audioOutputSource.map((device) => (
                        <MenuItem key={device.deviceId} value={device.deviceId}>
                          {device.label || `speaker ${device.deviceId}`}
                        </MenuItem>
                      ))}
                  </Select>
                  <Typography
                    component="span"
                    sx={{
                      position: "absolute",
                      top: "56%",
                      transform: "translate(0,-50%)",
                      left: "19px",
                    }}
                  >
                    <Icon icon="fluent:speaker-1-24-regular" fontSize={20} />
                  </Typography>
                </FormControl>
              </Box>
            </DialogContent>

            <DialogActions>
              <Button color="primary" variant="contained" onClick={handleSubmit}>
                Submit
              </Button>

              <Button color="primary" variant="outlined" onClick={props.onClose}>
                Close
              </Button>
            </DialogActions>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default SessionSettings;
