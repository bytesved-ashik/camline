import { Box, Grid, Paper, Skeleton } from "@mui/material";

export default function QuestionSkeletonCard() {
  return (
    <Box sx={{ margin: " auto", maxWidth: "900px" }}>
      <Paper elevation={8}>
        <Box sx={{ padding: "40px 50px" }}>
          <Skeleton variant="text" width={"80%"} height={"4rem"} sx={{ margin: "0 auto" }} />
          <Skeleton variant="text" width={"40%"} height={"2rem"} sx={{ margin: "0 auto" }} />
          <Grid container spacing={2} mb={8}>
            {["", "", "", "", ""].map((option, i) => (
              <Grid item lg={6} key={i}>
                <Skeleton variant="text" width={"15rem"} height={"6rem"} />
              </Grid>
            ))}
          </Grid>
          <Skeleton variant="rounded" width={"100%"} height={"3rem"} />
        </Box>
      </Paper>
    </Box>
  );
}
