import { Icon } from "@iconify/react";
import { Box, Typography } from "@mui/material";

import CustomAvatar from "src/@core/components/mui/avatar";
import React from "react";

const CardStatsSession = (props: any) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <CustomAvatar skin="light" variant="rounded" color={props.color} sx={{ mr: 4 }}>
        <Icon icon={props.icon} />
      </CustomAvatar>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {props.stats}
          <Typography
            component="span"
            variant="caption"
            sx={{ display: "inline-flex", ml: 2, alignItems: "center" }}
            color={props.colorStatus}
          >
            <Icon icon={props.iconStats} fontSize="1.4rem" />
            {props.status}
          </Typography>
        </Typography>
        <Typography variant="caption">{props.title}</Typography>
      </Box>
    </Box>
  );
};

export default CardStatsSession;
