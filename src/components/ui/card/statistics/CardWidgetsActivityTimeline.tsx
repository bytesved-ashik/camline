// ** MUI Imports
import { Typography } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";

// ** Custom Components Imports
import OptionsMenu from "src/@core/components/option-menu";

// Styled Timeline component

const CardWidgetsActivityTimeline = () => {
  return (
    <Card sx={{ position: "relative" }}>
      <CardHeader
        title="Activity Timeline"
        action={
          <OptionsMenu
            options={["Last 28 Days", "Last Month", "Last Year"]}
            iconButtonProps={{ size: "small", className: "card-more-options" }}
          />
        }
      />
      <CardContent sx={{ pt: (theme) => `${theme.spacing(2.5)} !important` }}>
        <Typography sx={{ position: "absolute", top: "48%", left: "39%" }}>No data available</Typography>
      </CardContent>
    </Card>
  );
};

export default CardWidgetsActivityTimeline;
