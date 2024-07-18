import { Avatar, Box, Typography } from "@mui/material";
import React from "react";

const TherapistSingleRounded = (props: any) => {
  return (
    <Box sx={{ textAlign: "center" }}>
      <Box
        sx={{
          width: "76px",
          height: "76px",
          margin: "0 auto",
          borderRadius: "50%",
          padding: "5px",
          border: "1px solid #666CFF",
        }}
      >
        <Avatar
          alt="Victor Anderson"
          sx={{ width: "100%", height: "100%", margin: "0 auto", objectFit: "cover" }}
          src={props.image}
        />
      </Box>
      <Typography variant="subtitle2" color="text.primary">
        {props.name}
      </Typography>
    </Box>
  );
};

export default TherapistSingleRounded;
