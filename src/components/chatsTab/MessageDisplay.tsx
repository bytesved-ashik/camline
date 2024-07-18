import React, { useEffect, useRef, useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import PublicChatSession from "@/views/pages/session/PublicChatSession";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { IAllChats } from "@/types/apps/chatTypes";

const MessageDisplay = ({ selectedProfileId, profileDetail }: { selectedProfileId: string; profileDetail?: IAllChats }) => {
  const [openEnterKey, setOpenEnterKey] = useState<boolean>(true);
  const [chatKey, setChatKey] = useState<string>("uniquekey");

  const [showPassword, setShowPassword] = React.useState(false);
  const chatKeyInputRef = useRef<HTMLInputElement>(null);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  useEffect(() => {
    // setChatKey(undefined);

    setOpenEnterKey(true);
  }, [selectedProfileId]);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <Paper elevation={3} style={{ padding: "20px", height: "100%" }}>
      {selectedProfileId ? (
        chatKey !== undefined && chatKey !== null ? (
          <PublicChatSession chatKey={chatKey} profileDetail={profileDetail} />
        ) : (
          <Dialog open={openEnterKey} aria-labelledby="customized-dialog-title" maxWidth="md" scroll="body" fullWidth>
            <DialogTitle id="customized-dialog-title" sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ textAlign: "center" }}>
                Enter your key
              </Typography>
              <Typography variant="caption" sx={{ textAlign: "center", display: "block" }}>
                This key allows you to view the message securely
              </Typography>
              <IconButton
                aria-label="close"
                onClick={() => {
                  setChatKey("");
                  setOpenEnterKey(false);
                }}
                sx={{
                  top: 10,
                  right: 10,
                  position: "absolute",
                  color: "grey.500",
                }}
              >
                <Icon icon="mdi:close" />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ p: 4 }}>
              <DialogContentText>
                <Box sx={{ mb: 4 }}>
                  <FormControl variant="outlined" sx={{ position: "relative" }} fullWidth>
                    <InputLabel htmlFor="outlined-adornment-key">Write your key</InputLabel>
                    <OutlinedInput
                      type={showPassword ? "text" : "password"}
                      inputRef={chatKeyInputRef}
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
                </Box>
              </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "center" }}>
              <Button
                variant="contained"
                onClick={() => {
                  setChatKey(chatKeyInputRef.current?.value ?? "");
                  if (chatKeyInputRef.current) {
                    chatKeyInputRef.current.value = "";
                  }
                  setOpenEnterKey(false);
                }}
              >
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        )
      ) : (
        <Box
          sx={{
            width: "100%",
            height: "75vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            "& svg": { mr: 2 },
          }}
        >
          <Icon icon="mdi:alert-circle-outline" fontSize={20} />
          <Typography variant="body1">Select a profile to view Messages</Typography>
        </Box>
      )}
    </Paper>
  );
};

export default MessageDisplay;
