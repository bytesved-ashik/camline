import { Grid, Paper } from "@mui/material";
import MeetTherapist from "src/views/pages/session/MeetTherapist";
import UserViewsQuery from "src/views/pages/session/UserViewsQuery";

export default function PreSession() {
  return (
    <Paper
      sx={{
        padding: {
          lg: 0,
          xs: "0 30px",
        },
      }}
    >
      <Grid container alignItems="center" mt={6}>
        <Grid
          item
          xl={3}
          lg={4}
          xs={12}
          sx={{
            order: {
              lg: "1",
              xs: "2",
            },
          }}
        >
          <UserViewsQuery />
        </Grid>
        <Grid
          item
          xl={9}
          lg={8}
          xs={12}
          sx={{
            order: {
              lg: "2",
              xs: "1",
            },
          }}
        >
          <MeetTherapist />
        </Grid>
      </Grid>
    </Paper>
  );
}
