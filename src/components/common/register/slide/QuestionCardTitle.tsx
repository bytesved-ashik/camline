import { Box, Typography } from "@mui/material";

interface IProps {
  title: string;
  description?: string;
}
export default function QuestionCardTitle({ title, description }: IProps) {
  return (
    <Box
      sx={{
        padding: "40px 50px 0",
        "@media screen and (max-width: 767px)": {
          padding: "0px",
        },
      }}
    >
      <Typography
        sx={{
          textAlign: "center",
          fontWeight: "700",
          fontSize: "1.5rem",
          lineHeight: "133.4%",
          marginBottom: "12px",
          color: "text.black",
        }}
      >
        {title}
      </Typography>
      {description && (
        <Typography
          sx={{
            textAlign: "center",
            fontWeight: "400",
            fontSize: "0.875rem",
            lineHeight: "133.4%",
            marginBottom: "30px",
            color: "#7F889B",
          }}
        >
          {description}
        </Typography>
      )}
    </Box>
  );
}
