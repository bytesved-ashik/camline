import { Typography } from "@mui/material";
import React from "react";

type ICaption = {
  title: string;
  subText: string;
};
const Caption = ({ data }: { data: ICaption }) => {
  return (
    <>
      <Typography variant="h5" sx={{ color: "text.black" }}>
        {data.title}
      </Typography>
      <Typography variant="body2">{data.subText}</Typography>
    </>
  );
};

export default Caption;
