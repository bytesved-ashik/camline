import { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import SwipeableViews from "react-swipeable-views";
import RegisterForm from "./slide/RegisterForm";
import RegistrationCompletePage from "./slide/RegistrationCompletePage";
import GetStarted from "./slide/GetStarted";
import { Grid } from "@mui/material";
import { ROLE } from "@/enums/role.enums";

const AutoPlaySwipeableViews = SwipeableViews;

export default function RegisterCards() {
  const [activeStep, setActiveStep] = useState(0);
  const [role, setRole] = useState<ROLE>(ROLE.USER);
  const maxSteps = 3;
  const minSteps = 1;
  const [email, setEmail] = useState("");

  const theme = useTheme();
  const handleNext = (skipStep?: boolean) => {
    setActiveStep((prevActiveStep) => {
      if (skipStep) return prevActiveStep + 2;
      if (prevActiveStep + 1 < maxSteps) {
        return prevActiveStep + 1;
      } else {
        return prevActiveStep;
      }
    });
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => {
      if (prevActiveStep === minSteps) {
        setRole(ROLE.USER);
      }

      if (role === ROLE.USER && prevActiveStep === 4) {
        return prevActiveStep - 2;
      }

      return prevActiveStep - 1;
    });
  };

  useEffect(() => {
    // if (role === ROLE.THERAPIST) {
    //   setDefaultCardCount(7);
    // } else {
    //   setDefaultCardCount(6);
    // }
  }, [role]);

  useEffect(() => {
    if (role === ROLE.USER && activeStep === 3) {
      handleNext();
    }
  }, [activeStep]);

  return (
    <Grid container sx={{ margin: "auto", padding: "20px 0", flex: "1" }}>
      <AutoPlaySwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={activeStep}
        animateHeight={false}
        disableLazyLoading={false}
      >
        <GetStarted
          handleNext={() => {
            // GOTO: first step after selection of role
            setActiveStep(1);
          }}
          setRole={setRole}
        />

        <RegisterForm
          handleNext={handleNext}
          handleBack={handleBack}
          activeStep={activeStep}
          maxSteps={maxSteps}
          role={role}
          setEmail={setEmail}
        />

        <RegistrationCompletePage email={email} />
      </AutoPlaySwipeableViews>
    </Grid>
  );
}
