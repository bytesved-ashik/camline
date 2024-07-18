import { Icon } from "@iconify/react";
import { Button, DialogContent, Dialog, DialogTitle, DialogContentText, DialogActions, Typography } from "@mui/material";
import Fade, { FadeProps } from "@mui/material/Fade";
import React, { Ref, forwardRef, ReactElement } from "react";

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />;
});
const CustomDialog = (props: any) => {
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      scroll="body"
      onClose={props.onClose}
      open={props.open}
      TransitionComponent={Transition}
      onBackdropClick={props.onClose}
      style={props.fullscreen ? { zIndex: 9999 } : {}}
    >
      <DialogContent sx={{ position: "relative", p: 0 }}>
        <DialogTitle id="alert-dialog-title" sx={{ display: "flex", alignItems: "center" }}>
          <Typography sx={{ color: "error.main", mr: props.space, fontSize: "1.4rem" }}>
            <Icon icon={props.icon} />
          </Typography>
          {props.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{props.desc}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color={props.color} onClick={props.onEnd}>
            {props.btnText}
          </Button>
          {props.showSingleBtn ? null : (
            <Button color={props.color} variant="contained" onClick={props.onClose} autoFocus>
              {props.action}
            </Button>
          )}
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialog;
