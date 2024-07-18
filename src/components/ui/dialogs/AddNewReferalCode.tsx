import { AddReferals } from "@/services/user.service";
import { Icon } from "@iconify/react";
import {
  Button,
  DialogContent,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogActions,
  Typography,
  TextField,
  Grid,
} from "@mui/material";
import Fade, { FadeProps } from "@mui/material/Fade";
import React, { Ref, forwardRef, ReactElement, useState } from "react";
import * as toast from "@/utils/toast";

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />;
});

const AddNewReferalCode = (props: any) => {
  const [formData, setFormData] = useState({
    source: "",
    referralCode: "",
  });

  const [isError, setIsError] = useState(false);

  const onSubmit = () => {
    if (formData.referralCode) {
      AddReferals({ ...formData })
        .then(() => {
          toast.success("Added.");
          props.onClose();
        })
        .catch((err: any) => {
          toast.error(err?.response?.data?.message ?? "Referral Code not added.");
        });
    } else {
      setIsError(true);
    }
  };

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
          Add Referral Code
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Grid direction="column" container spacing={3} sx={{ marginTop: "5px" }}>
              <Grid item xs={7}>
                <TextField
                  onChange={(e) => setFormData({ ...formData, referralCode: e.target.value })}
                  label="Referral Code"
                  type="text"
                  variant="outlined"
                  placeholder="Please Type Referral Code"
                  fullWidth
                  value={formData.referralCode}
                />
                {isError && formData.referralCode === "" && (
                  <Typography color={"red"}> Please enter Referral Code</Typography>
                )}
              </Grid>

              <Grid item xs={7}>
                <TextField
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  label="Source"
                  type="text"
                  variant="outlined"
                  placeholder="Please Type Source"
                  fullWidth
                  value={formData.source}
                />
              </Grid>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={onSubmit}>
            Add
          </Button>
          <Button color={props.color} variant="outlined" onClick={props.onClose} autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewReferalCode;
