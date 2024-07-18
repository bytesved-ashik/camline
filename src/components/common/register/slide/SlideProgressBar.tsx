import { Box, MobileStepper, Typography } from "@mui/material";

interface IProps {
  maxSteps: number;
  activeStep: number;
}

export default function SlideProgressBar({ maxSteps, activeStep }: IProps) {
  return (
    <Box sx={{ maxWidth: "200px", display: "flex", width: "100%" }}>
      <Box sx={{ flex: 1 }}>
        <MobileStepper
          steps={maxSteps}
          position="static"
          variant="progress"
          activeStep={activeStep}
          className="steps"
          backButton={undefined}
          nextButton={undefined}
          sx={{ bgcolor: "#ffffff" }}
        />
      </Box>
      <Typography sx={{ color: "#546FFF" }}>{Math.round((activeStep / maxSteps) * 100)}% </Typography>
    </Box>
  );
}
