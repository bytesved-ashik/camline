import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { IMAGES } from "src/assets";

type IProps = {
  verify: string;
};

export default function RegistrationVerify({ verify }: IProps) {
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
              {verify}
            </Typography>
            <Stack sx={{ flexDirection: "row" }}>
              <Button variant="contained" onClick={() => signIn()} sx={{ marginRight: "16px" }}>
                Sign in
              </Button>
              <Button variant="outlined" href="/support-channel">
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
