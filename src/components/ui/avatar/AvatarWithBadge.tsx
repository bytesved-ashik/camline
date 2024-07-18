import { Avatar, Badge } from "@mui/material";
import React from "react";
import { styled } from "@mui/material/styles";

const AvatarWithBadge = (props: { image?: string }) => {
  const BadgeContentSpan = styled("span")(({ theme }) => ({
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: theme.palette.success.main,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
  }));

  return (
    <Badge
      overlap="circular"
      badgeContent={<BadgeContentSpan />}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
    >
      <Avatar alt="Marie Garza" src={props.image} />
    </Badge>
  );
};

export default AvatarWithBadge;
