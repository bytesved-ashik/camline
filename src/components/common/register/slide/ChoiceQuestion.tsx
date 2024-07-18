import { IQuestionAnswered, IQuestionData } from "src/types/interfaces/authQuestions.interface";
import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import QuestionCardTitle from "./QuestionCardTitle";
import SlideProgressBar from "./SlideProgressBar";
import Icon from "src/@core/components/icon";
import PeopleIcon from "@mui/icons-material/SupervisedUserCircle";
import { ROLE } from "@/enums/role.enums";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import CheckBoxSelect from "./CheckBoxSelect";
import * as toast from "@/utils/toast";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

interface IProps {
  handleNext: () => void;
  handleBack: () => void;
  maxSteps: number;
  activeStep: number;
  questionData: IQuestionData;
  setQuestionsAnswered: Dispatch<SetStateAction<IQuestionAnswered[]>>;
  questionsAnswered: IQuestionAnswered[];
}

export default function ChoiceQuestion({
  handleNext,
  handleBack,
  maxSteps,
  activeStep,
  questionData,
  questionsAnswered,
  setQuestionsAnswered,
}: IProps) {
  const [answersSelected, setAnswersSelected] = useState<string[]>([]);
  const handleClick = () => {
    if (answersSelected.length === 0) {
      toast.error("Please select at least one option");

      return;
    }
    setQuestionsAnswered([...questionsAnswered, { question: questionData.title, answers: answersSelected }]);
    handleNext();
  };
  useEffect(() => {
    if (questionsAnswered.length === 0) {
      setAnswersSelected([]);
    }
  }, [questionsAnswered]);

  return (
    <>
      <Box sx={{ margin: "auto", maxWidth: "900px" }}>
        <Paper elevation={8} sx={{ margin: "auto" }}>
          <Box
            sx={{
              padding: "40px 50px",
            }}
          >
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
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "normal", whiteSpace: "nowrap", textTransform: "capitalize" }}
                  >
                    Go Back
                  </Typography>
                </Box>
              </Button>
            </Box>
            <QuestionCardTitle title={questionData.title} description="Choose from the options below" />

            <Grid container spacing={2}>
              {questionData.answers.map((option, i) => (
                <CheckBoxSelect
                  key={i}
                  title={questionData.answers[i]}
                  value={questionData.answers[i]}
                  setState={setAnswersSelected}
                  state={answersSelected}
                />
              ))}
            </Grid>
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
                    {questionData.role === ROLE.THERAPIST && (
                      <Icon icon="material-symbols:physical-therapy" color="#546FFF" />
                    )}
                    {questionData.role === ROLE.USER && <PeopleIcon sx={{ color: "#546FFF" }} />}
                  </Box>
                  <Typography sx={{ color: "#546FFF", fontWeight: "700", textTransform: "capitalize" }}>
                    {questionData.role}
                  </Typography>
                  <Button
                    variant="contained"
                    disabled={answersSelected.length === 0}
                    sx={{ marginLeft: "30px" }}
                    onClick={handleClick}
                  >
                    Next
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </Box>
        </Paper>
      </Box>
    </>
  );
}
