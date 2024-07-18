import { Box, Button, Dialog, DialogContent, Grid, Typography } from "@mui/material";
import { Ref, forwardRef, ReactElement } from "react";
import Fade, { FadeProps } from "@mui/material/Fade";
import { useRouter } from "next/router";

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />;
});

const TherapistMedia = (props: any) => {
  const route = useRouter();

  return (
    <>
      <Dialog
        fullWidth
        open={props.showDialog}
        maxWidth="md"
        scroll="body"
        onClose={props.closeDialog}
        TransitionComponent={Transition}
      >
        <DialogContent
          sx={{
            px: { xs: 8, sm: 15 },
            py: { xs: 8, sm: 12.5 },
            position: "relative",
          }}
        >
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography variant="h6" sx={{ mb: 3, lineHeight: "2rem" }}>
              Document verification is an important step for using this platform. We could not complete your document
              verification. We request you to re upload your certificates, please ensure the quality of documents is good to
              avoid rejection. Click on the button below to go to your profile page and re upload the documents.
            </Typography>
          </Box>
          <Grid
            direction="column"
            sx={{
              textAlign: "center",
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box sx={{ width: 250, marginTop: 10 }}>
              <Button
                variant="contained"
                sx={{ width: "100%" }}
                onClick={() => {
                  route.push("/user-account");
                  if (props.close) props.close();
                }}
              >
                Upload Profile
              </Button>
            </Box>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TherapistMedia;
