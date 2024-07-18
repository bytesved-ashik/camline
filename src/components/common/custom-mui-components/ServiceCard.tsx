import { ThemeProvider, Typography } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowOutwardSharpIcon from "@mui/icons-material/ArrowOutwardSharp";
import { useState } from "react";
import themeOptions from "@/@core/theme/ThemeOptions";
import { Settings } from "src/@core/context/settingsContext";

type IServiceCardData = {
  id: number;
  title: string;
  description: string;
};

const ServiceCard = (data: IServiceCardData) => {
  const [arrowIcon, setArrowIcon] = useState(true);
  const settings: Partial<Settings> = {
    mode: "light",
  };

  const theme = themeOptions(settings as Settings);

  return (
    <ThemeProvider theme={theme}>
      <Accordion
        sx={{ boxShadow: "none !important", padding: "0", minHeight: "auto !important" }}
        disableGutters
        className="accordianBox"
      >
        <AccordionSummary
          aria-controls="panel1d-content"
          id="panel1d-header"
          sx={{
            py: 0,
            px: 3,
            minHeight: "auto !important",
            margin: 0,
            alignItems: "center",
            boxShadow: "none",
          }}
          onClick={() => setArrowIcon((prevState) => !prevState)}
        >
          <ArrowOutwardSharpIcon
            color="primary"
            sx={{
              fontSize: 17,
              border: 2,
              borderRadius: "4px",

              height: "25px",
              width: "25px",
              p: "2px",
              ":hover": { color: "#1b3fff" },
            }}
          />
          <Typography sx={{ fontWeight: "700", flex: "1", marginLeft: "12px", color: "#111013" }}> {data.title}</Typography>
          {arrowIcon ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
        </AccordionSummary>
        <AccordionDetails sx={{ pt: "1.25rem !important", px: 3, pb: 3 }}>
          {data.description ? <Typography color="rgba(76, 78, 100, 0.6);">{data.description}</Typography> : null}
        </AccordionDetails>
      </Accordion>
    </ThemeProvider>
  );
};

export default ServiceCard;
