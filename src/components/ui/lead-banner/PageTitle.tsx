import React from "react";

import { Breadcrumbs, Grid, Link, Typography } from "@mui/material";

const PageTitle = (props: any) => {
  return (
    <Grid
      container
      spacing={6}
      sx={{ mt: "0px", py: 14, background: "linear-gradient(101.29deg, #546FFF -24.85%, #1B2D8B 99.63%)" }}
    >
      <Grid item xs={12}>
        <Typography variant="h3" sx={{ textAlign: "center", color: "white", mb: 4, textTransform: "capitalize" }}>
          {props.title}
        </Typography>

        <Breadcrumbs
          aria-label="breadcrumb"
          sx={{
            "& ol": {
              justifyContent: "center",
              margin: "auto",
              color: "#fff",
            },
          }}
        >
          <Link underline="hover" color="rgba(255, 255, 255, 0.6)" href="/">
            Home
          </Link>
          <Typography color="#fff">{props.title}</Typography>
        </Breadcrumbs>
      </Grid>
    </Grid>
  );
};

export default PageTitle;
