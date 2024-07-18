import { Icon } from "@iconify/react";
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Paper,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  DialogActions,
  Button,
} from "@mui/material";
import Fade, { FadeProps } from "@mui/material/Fade";
import React, { Ref, forwardRef, ReactElement } from "react";
import DateTimeInline from "../calendar/DateTimeInline";

import { useTheme } from "@mui/material/styles";
import { ReactDatePickerProps } from "react-datepicker";

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />;
});

const ScheduleDialog = (props: any) => {
  const theme = useTheme();
  const { direction } = theme;
  const popperPlacement: ReactDatePickerProps["popperPlacement"] = direction === "ltr" ? "bottom-start" : "bottom-end";

  return (
    <Dialog
      fullWidth
      open={props.showDialog}
      maxWidth="md"
      scroll="body"
      onClose={props.onCloseDialog}
      TransitionComponent={Transition}
      onBackdropClick={props.onCloseDialog}
    >
      <DialogContent sx={{ px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: "relative" }}>
        <IconButton size="small" onClick={props.onCloseDialog} sx={{ position: "absolute", right: "1rem", top: "1rem" }}>
          <Icon icon="mdi:close" />
        </IconButton>
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography variant="h5" sx={{ mb: 3, lineHeight: "2rem" }}>
            Create a schedule
          </Typography>
          <Typography variant="body2">Use this form to create a schedule for the patient</Typography>
        </Box>
      </DialogContent>

      <DialogContent sx={{ px: { xs: 8, sm: 15 }, pb: { xs: 8, sm: 12.5 }, position: "relative" }}>
        <Paper elevation={4}>
          <ListItem>
            <ListItemAvatar>
              <Avatar src={`/images/avatars/1.png`} alt="" sx={{ height: 40, width: 40 }} />
            </ListItemAvatar>
            <ListItemText primary="Karen Angela" secondary="Patient" />
          </ListItem>
        </Paper>
        <Box mt={8} sx={{ display: "flex", mx: "-16px" }}>
          <Box px={"16px"}>
            <DateTimeInline popperPlacement={popperPlacement} />
          </Box>
          <Box sx={{ flex: 1, px: "16px" }}>
            <Typography sx={{ mb: 4, fontWeight: 600 }}>Fee Details</Typography>

            <Box
              sx={{
                mb: 2,
                gap: 2,
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography>Session charges:</Typography>
              <Typography sx={{ fontWeight: 600 }}>£250</Typography>
            </Box>
            <Box
              sx={{
                mb: 2,
                gap: 2,
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography>Platform fees:</Typography>
              <Typography sx={{ fontWeight: 600 }}>3%</Typography>
            </Box>
            <Box
              sx={{
                mb: 2,
                gap: 2,
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography>Discount:</Typography>
              <Typography sx={{ fontWeight: 600 }}>10%</Typography>
            </Box>
            <Box
              sx={{
                mb: 2,
                gap: 2,
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography>Taxes:</Typography>
              <Typography sx={{ fontWeight: 600 }}>£3</Typography>
            </Box>
            <Divider />
            <Box
              sx={{
                mb: 2,
                gap: 2,
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography>Discount:</Typography>
              <Typography sx={{ fontWeight: 600 }}>N/A</Typography>
            </Box>
            <Box
              sx={{
                mb: 2,
                gap: 2,
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography>Taxes:</Typography>
              <Typography sx={{ fontWeight: 600 }}>N/A</Typography>
            </Box>
            <Box sx={{ py: 3, px: 4, borderRadius: 1, backgroundColor: "action.hover", mt: 6 }}>
              <Typography variant="caption" sx={{ mb: 2, color: "primary.main" }}>
                You will be paid
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, fontWeight: 600, color: "primary.main" }}>
                £229.89
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center" }}>
        <Button color="primary" variant="contained" onClick={props.onCloseDialog}>
          Submit
        </Button>
        <Button color="primary" variant="outlined" onClick={props.onCloseDialog} autoFocus>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScheduleDialog;
