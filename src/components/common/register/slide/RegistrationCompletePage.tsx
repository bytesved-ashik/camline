import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { IMAGES } from "src/assets";
import { SupportEmailLink } from "@/constants/environmentConstant";

export default function RegistrationCompletePage({ email }: { email: string }) {
  return (
    <Box sx={{ padding: "20px" }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item lg={9}>
          <Box sx={{ maxWidth: "784px" }}>
            <Typography
              sx={{
                marginBottom: "20px",
                fontWeight: 700,
                fontSize: "48px",
                lineHeight: "56px",
                letterSpacing: "-1px",
                color: "#111013",
              }}
            >
              You’re almost there!
            </Typography>
            <Typography variant={"body1"} sx={{ marginBottom: "20px", color: "#6D788D" }}>
              An email has been sent to you at{" "}
              <span style={{ fontWeight: "700", color: "#546FFF", display: "inline-block" }}>{email}</span>. Please check
              your inbox and verify your email. If you do not receive the email, please contact us by clicking the{" "}
              <a href={SupportEmailLink} style={{ fontWeight: "700", color: "#546FFF", display: "inline-block" }}>
                {" "}
                support channel{" "}
              </a>{" "}
              button below.
            </Typography>
            <Stack sx={{ flexDirection: "row" }}>
              <Button variant="contained" onClick={() => signIn()} sx={{ marginRight: "16px" }}>
                Sign in
              </Button>
              <Button variant="outlined" href={SupportEmailLink}>
                Support Channel
              </Button>
            </Stack>
          </Box>
        </Grid>
        <Grid item lg={3}>
          <Image src={IMAGES.boardingImage} alt="vector Image" />
        </Grid>
      </Grid>
    </Box>
  );
}
