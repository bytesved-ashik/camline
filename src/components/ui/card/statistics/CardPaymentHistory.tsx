// ** MUI Imports
import { Typography } from "@mui/material";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";

// ** Custom Components Imports
import OptionsMenu from "src/@core/components/option-menu";

const CardPaymentHistory = () => {
  return (
    <Card sx={{ position: "relative" }}>
      <CardHeader
        title="Payment History"
        titleTypographyProps={{
          sx: {
            lineHeight: "2rem !important",
            letterSpacing: "0.15px !important",
          },
        }}
        action={
          <OptionsMenu
            options={["Last 28 Days", "Last Month", "Last Year"]}
            iconButtonProps={{ size: "small", className: "card-more-options" }}
          />
        }
      />

      <Typography sx={{ position: "absolute", top: "48%", left: "39%" }}>No data available</Typography>
    </Card>
  );
};

export default CardPaymentHistory;
