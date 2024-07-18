import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";
import QuestionCardTitle from "./QuestionCardTitle";
import { FormEventHandler } from "react";
import SlideProgressBar from "./SlideProgressBar";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CustomTimePicker from "../../time-picker";
import { ROLE } from "@/enums/role.enums";
import Icon from "src/@core/components/icon";
import { IAvaibilityTime } from "@/types/interfaces/auth.interface";

interface IProps {
  handleNext: (skipStep?: boolean) => void;
  handleBack: () => void;
  maxSteps: number;
  activeStep: number;
  avaibility: string;
  avaibilityTime: IAvaibilityTime[];
  setAvaibility: (val: string) => void;
  setAvaibilityTime: (val: IAvaibilityTime[]) => void;
}

export default function AvaibilityForm({
  handleNext,
  handleBack,
  maxSteps,
  activeStep,
  avaibility,
  avaibilityTime,
  setAvaibility,
  setAvaibilityTime,
}: IProps) {
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    handleNext();
  };

  const isDisable =
    avaibility === "24"
      ? true
      : avaibilityTime.filter((data) => data.startDate === null && data.endDate === null).length === 0;

  return (
    <Box sx={{ margin: { xs: "0 auto", lg: "6% auto" }, maxWidth: "900px" }}>
      <Paper elevation={8} sx={{ margin: "auto" }}>
        <Box sx={{ padding: "40px 80px" }}>
          <Box
            sx={{
              position: "relative",
              marginBottom: "20px",
            }}
          >
            <Button
              variant="text"
              sx={{ display: "flex", alignItems: "center", padding: 0, color: "inherit" }}
              onClick={handleBack}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <ArrowBackIosIcon style={{ marginRight: "0px" }} />
                <Typography variant="body2" sx={{ fontWeight: "normal", whiteSpace: "nowrap", textTransform: "capitalize" }}>
                  Go Back
                </Typography>
              </Box>
            </Button>
          </Box>
          <QuestionCardTitle title="Provide your avaibility details" description="" />
          <form onSubmit={handleSubmit}>
            <Grid container spacing={4} mt={5} mb={5} justifyContent={"space-between"}>
              <FormControl sx={{ mb: 3 }} fullWidth variant="outlined">
                <FormLabel id="avaibility-label">Availability</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="avaibility-label"
                  name="avaibility"
                  value={avaibility}
                  onChange={(e) => setAvaibility(e.target.value)}
                >
                  <FormControlLabel value="24" control={<Radio />} label="24 Hour Available" />
                  <FormControlLabel value="0" control={<Radio />} label="Choose Time" />
                </RadioGroup>
              </FormControl>
            </Grid>

            {avaibility === "0" && (
              <Grid container spacing={4} mb={5}>
                {avaibilityTime.map((val, index) => (
                  <Box key={`avaibility-time-${index}`} sx={{ display: "flex", gap: 5, alignItems: "center", mb: 5 }}>
                    <Box sx={{ minWidth: { sm: "10vw", xs: "20vw" } }}>
                      <Typography variant="h6">{val.dayInString}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 5, flexDirection: { sm: "row", xs: "column" } }}>
                      <CustomTimePicker
                        label="From"
                        value={val.startDate}
                        onChange={(val) => {
                          const obj = JSON.parse(JSON.stringify(avaibilityTime));
                          obj[index].startDate = val?.format("HH:mm:ss").toString() ?? null;
                          setAvaibilityTime(obj);
                        }}
                      />
                      <CustomTimePicker
                        label="To"
                        value={val.startDate}
                        onChange={(val) => {
                          const obj = JSON.parse(JSON.stringify(avaibilityTime));
                          obj[index].endDate = val?.format("HH:mm:ss").toString() ?? null;
                          setAvaibilityTime(obj);
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Grid>
            )}

            <Stack sx={{ flexDirection: "row", alignItems: "center", marginTop: "50px" }}>
              <SlideProgressBar activeStep={activeStep} maxSteps={maxSteps} />
              <Box sx={{ flex: "1", textAlign: "right" }}>
                <Stack direction="row" justifyContent="flex-end" alignItems="center">
                  <Box
                    sx={{
                      background: "linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #666CFF",
                      marginRight: "10px",
                      width: "37px",
                      height: "37px",
                      borderRadius: "100px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon icon="material-symbols:physical-therapy" color="#546FFF" />
                  </Box>
                  <Typography sx={{ color: "#546FFF", fontWeight: "700", textTransform: "capitalize" }}>
                    {ROLE.THERAPIST}
                  </Typography>
                  <Button disabled={!isDisable} onClick={() => handleNext()} variant="contained" sx={{ marginLeft: "30px" }}>
                    Next
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </form>
        </Box>
      </Paper>
    </Box>
  );
}
