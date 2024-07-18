import { Icon } from "@iconify/react";
import { Box, Button, CardContent, Dialog, DialogContent, Grid, IconButton, Typography } from "@mui/material";
import { Ref, forwardRef, ReactElement } from "react";
import Fade, { FadeProps } from "@mui/material/Fade";
import { deleteAllRequest } from "@/services/session.service";

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />;
});

const ClearRequest = (props: any) => {
  const onClear = () => {
    deleteAllRequest()
      .then(() => {
        props.clearRequest();
      })
      .catch((err) => {
        console.log("error => ", err.response);
      });
  };

  return (
    <>
      <Dialog
        fullWidth
        open={props.showDialog}
        maxWidth="md"
        scroll="body"
        onClose={props.closeDialog}
        TransitionComponent={Transition}
        onBackdropClick={props.closeDialog}
      >
        <DialogContent
          sx={{
            px: { xs: 8, sm: 15 },
            py: { xs: 8, sm: 12.5 },
            position: "relative",
          }}
        >
          <IconButton size="small" onClick={props.closeDialog} sx={{ position: "absolute", right: "1rem", top: "1rem" }}>
            <Icon icon="mdi:close" />
          </IconButton>
          <Grid direction="column" container spacing={6}>
            <Grid item xs={5}>
              <Box
                sx={{
                  mb: 4,
                  borderRadius: 1,
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                }}
              >
                <CardContent>
                  <Typography sx={{ mb: 4, fontWeight: 600 }}>Request Already in pool</Typography>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
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
                      <Typography variant="body2" sx={{ color: "text.primary" }}>
                        Do you want to withdraw your previous request?
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Button variant="contained" sx={{ marginRight: 10 }} onClick={onClear}>
                  Yes
                </Button>
                <Button variant="contained" color="error" onClick={props.closeDialog}>
                  No
                </Button>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ClearRequest;
