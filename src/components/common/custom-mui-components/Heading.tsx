import { Typography } from "@mui/material";
import { PropsWithChildren } from "react";

type IHeadingProps = {
  usePrimaryColor?: boolean;
};

export default function Heading({ usePrimaryColor, children }: PropsWithChildren<IHeadingProps>) {
  return (
    <Typography
      variant={usePrimaryColor ? "inherit" : "h3"}
      marginTop={"20px"}
      color={usePrimaryColor ? "primary" : "inherit"}
      display={usePrimaryColor ? "inline" : "inherit"}
    >
      {" "}
      {children}{" "}
    </Typography>
  );
}
