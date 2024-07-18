import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { IconButton } from "@mui/material";
import Icon from "src/@core/components/icon";

type IProps = {
  filepath: string;
  name: string;
};

export default function ViewCertificate({ filepath, name }: IProps) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        {name}
      </Button>
      <Dialog fullScreen open={open} onClose={handleClose}>
        <DialogActions>
          <IconButton color="inherit" aria-haspopup="true" onClick={handleClose}>
            <Icon icon={"mdi:close"} />
          </IconButton>
        </DialogActions>
        <DialogContent
          sx={{
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
          }}
        >
          <iframe src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${filepath}`} width="80%" height="100%" />
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
