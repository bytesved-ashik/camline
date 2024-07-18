import { Box, Button, Divider, Paper, Stack, Typography } from "@mui/material";
import Icon from "src/@core/components/icon";
import PeopleIcon from "@mui/icons-material/SupervisedUserCircle";
import SlideProgressBar from "./SlideProgressBar";
import { ROLE } from "@/enums/role.enums";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

interface IProps {
  handleNext: () => void;
  handleBack: () => void;
  maxSteps: number;
  activeStep: number;
  role: string;
}

const planData = [
  {
    title: "Private Session",
    value: "£500.00 /session",
  },
  {
    title: "Platform fee",
    value: "12.5%",
  },
  {
    title: "Miscellaneous fee",
    value: "£12.00",
  },
  {
    title: "Lorem ipsum",
    value: "£12.00/Session",
  },
];

export default function StartUpPlan({ handleNext, handleBack, maxSteps, activeStep, role }: IProps) {
  const handleSubmit = async () => {
    handleNext();
  };

  return (
    <Box sx={{ margin: "0 auto", maxWidth: "900px" }}>
      <Box sx={{ padding: "5px 50px" }}>
        <Typography
          sx={{
            textAlign: "center",
            fontWeight: "700",
            fontSize: "2.125rem",
            lineHeight: "133.4%",
            marginBottom: "12px",
            color: "text.black",
          }}
        >
          We have setup your startup plan
        </Typography>
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
          Below you will learn about how you will get started with our plans for 24 hour therapy
        </Typography>
        <Paper elevation={8} sx={{ margin: "auto" }}>
          <Box sx={{ padding: "20px" }}>
            <Stack sx={{ flexDirection: "row", alignItems: "center" }}>
              <Box sx={{ flex: "1" }}>
                <Box
                  sx={{
                    position: "relative",
                    marginBottom: "40px",
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
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "normal", whiteSpace: "nowrap", textTransform: "capitalize" }}
                      >
                        Go Back
                      </Typography>
                    </Box>
                  </Button>
                </Box>
                <Typography
                  sx={{
                    fontWeight: "700",
                    fontSize: "1.5rem",
                    lineHeight: "133.4%",
                    color: "text.black",
                  }}
                >
                  Review your plan details
                </Typography>
                <Typography
                  sx={{
                    fontWeight: "400",
                    fontSize: "0.875rem",
                    lineHeight: "133.4%",
                    marginBottom: "24px",
                    color: "#7F889B",
                  }}
                >
                  Below is your start-up plan details for 24 Hour Therapy
                </Typography>

                <Typography
                  sx={{
                    fontWeight: "600",
                    fontSize: "1rem",
                    lineHeight: "150%",
                    marginBottom: "4px",
                    color: "rgba(76, 78, 100, 0.87)",
                  }}
                >
                  Your start-up plan will be
                </Typography>
                <Typography
                  sx={{
                    fontWeight: "500",
                    fontSize: "1.5rem",
                    lineHeight: "32.02px",
                    marginBottom: "24px",
                    color: "#384fc5",
                    fontFamily: "Gabarito",
                  }}
                >
                  Basic Plan - Level 1
                </Typography>
                <Typography
                  sx={{
                    fontWeight: "700",
                    fontSize: "17px",
                    lineHeight: "24px",
                    marginBottom: "4px",
                    color: "#4C4E64DE",
                    letterSpacing: "0.15px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  How to increase level?
                  <Box
                    sx={{
                      bgcolor: "#ededff",
                      borderRadius: "16px",
                      paddingX: "6px",
                      paddingY: "3px",
                      fontWeight: 400,
                      lineHeight: "18px",
                      letterSpacing: "0.16px",
                      color: "#666cff",
                      fontFamily: "inter",
                      cursor: "pointer",
                      fontSize: "13px",
                    }}
                  >
                    Terms & Condition
                  </Box>
                </Typography>
                <Typography
                  sx={{
                    fontWeight: "400",
                    fontSize: "0.875rem",
                    lineHeight: "133.4%",
                    marginBottom: "24px",
                    color: "#7F889B",
                  }}
                >
                  With more therapy sessions, you will be awarded with points.
                </Typography>
              </Box>
              <Box sx={{ textAlign: "center", maxWidth: "212px", width: "100%" }}>
                <Box
                  sx={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    marginBottom: "11px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: " linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #666CFF",
                  }}
                >
                  <Icon icon="carbon:skill-level-basic" style={{ color: "#546FFF", fontSize: "40px" }} />
                </Box>
                <Typography
                  sx={{
                    fontWeight: "500",
                    fontSize: "1rem",
                    lineHeight: "150%",
                    marginBottom: "4px",
                    color: "#546FFF",
                  }}
                >
                  Level 1
                </Typography>
                <Typography
                  sx={{
                    fontWeight: "400",
                    fontSize: "0.875rem",
                    lineHeight: "133.4%",
                    marginBottom: "24px",
                    color: "#546FFF",
                  }}
                >
                  Start-up basic plan
                </Typography>
              </Box>
            </Stack>
          </Box>
          <Divider />
          <Box sx={{ padding: "20px" }}>
            <Typography
              sx={{
                fontWeight: "600",
                fontSize: "1rem",
                lineHeight: "150%",
                marginBottom: "16px",
                color: "rgba(76, 78, 100, 0.87)",
              }}
            >
              Plan includes
            </Typography>
            {planData.map((data, i) => (
              <Box key={i} sx={{ display: "flex", flexWrap: "wrap", padding: "8px 0" }}>
                <Typography
                  sx={{
                    flex: "1",
                    fontWeight: "400",
                    fontSize: "0.875rem",
                    lineHeight: "133.4%",
                    color: "rgba(76, 78, 100, 0.6)",
                    letterSpacing: "0.15px",
                  }}
                >
                  {data.title}
                </Typography>
                <Typography
                  sx={{
                    fontWeight: "400",
                    fontSize: "0.875rem",
                    lineHeight: "133.4%",
                    color: "rgba(76, 78, 100, 0.6)",
                    letterSpacing: "0.15px",
                  }}
                >
                  {data.value}
                </Typography>
              </Box>
            ))}
            <Box sx={{ display: "flex", flexWrap: "wrap", padding: "8px 0" }}>
              <Typography
                sx={{
                  flex: "1",
                  fontWeight: "400",
                  fontSize: "0.875rem",
                  lineHeight: "133.4%",
                  color: "rgba(76, 78, 100, 0.6)",
                  letterSpacing: "0.15px",
                }}
              >
                Another Fee{" "}
              </Typography>
              <Typography
                sx={{
                  fontWeight: "700",
                  fontSize: "0.875rem",
                  lineHeight: "133.4%",
                  color: "#666CFF",
                  letterSpacing: "0.15px",
                }}
              >
                Important value
              </Typography>
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", padding: "8px 0" }}>
              <Typography
                sx={{
                  flex: "1",
                  fontWeight: "400",
                  fontSize: "0.875rem",
                  lineHeight: "133.4%",
                  color: "rgba(76, 78, 100, 0.6)",
                  letterSpacing: "0.15px",
                }}
              >
                Discussion Session
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "700",
                  fontSize: "0.875rem",
                  lineHeight: "133.4%",
                  color: "#4C4E6461",
                  letterSpacing: "0.15px",
                  display: "inline-block",
                  textDecoration: "line-through",
                }}
              >
                £5.00{" "}
                <Typography
                  variant="inherit"
                  sx={{
                    marginLeft: "5px",
                    display: "inline-block ",
                    color: "#72E128",
                    background: "linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #72E128",
                    padding: "3px 10px",
                    borderRadius: "100px",
                  }}
                >
                  {" "}
                  Free
                </Typography>
              </Typography>
            </Box>

            <Stack sx={{ flexDirection: "row", alignItems: "center", marginTop: "50px" }}>
              <SlideProgressBar activeStep={activeStep} maxSteps={maxSteps} />
              <Box
                sx={{
                  flex: "1",
                  textAlign: "right",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
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
                    {role === ROLE.THERAPIST && <Icon icon="material-symbols:physical-therapy" color="#546FFF" />}
                    {role === ROLE.USER && <PeopleIcon sx={{ color: "#546FFF" }} />}
                  </Box>
                  <Typography sx={{ color: "#546FFF", fontWeight: "700", textTransform: "capitalize" }}>{role}</Typography>
                </Stack>
                <Button variant="contained" sx={{ marginLeft: "30px" }} onClick={handleSubmit}>
                  Next
                </Button>
              </Box>
            </Stack>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
