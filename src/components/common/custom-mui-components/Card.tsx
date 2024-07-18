import { stringTruncate } from "@/utils/string";
import { Typography, Card as MuiCard, CardContent } from "@mui/material";

type ICardData = {
  title: string;
  description: string;
};

export default function Card({ data }: { data: ICardData }) {
  return (
    <MuiCard sx={{ background: "transparent", boxShadow: "none" }}>
      <CardContent
        sx={{
          padding: "0",
          mt: {
            lg: "0",
            xs: "30px",
          },
        }}
      >
        <Typography
          sx={{
            fontWeight: "600",
            letterSpacing: "0.15px",
            lineHeight: "1",
            fontSize: { xs: "50px", lg: "72px" },
          }}
          color="#354BC0"
          marginBottom="8px"
        >
          {data.title}
        </Typography>
        <Typography
          variant="body1"
          color="#4E4F55"
          fontSize="28px"
          letterSpacing="0.15px"
          sx={{
            fontWeight: "300",
            letterSpacing: "0.15px",
            fontSize: { xs: "18px", lg: "24px" },
          }}
        >
          {data.description ? stringTruncate(data.description, 115) : null}
        </Typography>
      </CardContent>
    </MuiCard>
  );
}
