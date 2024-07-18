import { IQuestionAnswered, IQuestionData } from "src/types/interfaces/authQuestions.interface";
import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import * as toast from "@/utils/toast";
import CheckBoxSelect from "../register/slide/CheckBoxSelect";
import QuestionCardTitle from "../register/slide/QuestionCardTitle";
import SlideProgressBar from "../register/slide/SlideProgressBar";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

interface IProps {
  handleNext: (answer: IQuestionAnswered[]) => void;
  handleBack: () => void;
  maxSteps: number;
  activeStep: number;
  questionData: IQuestionData;
  setQuestionsAnswered: Dispatch<SetStateAction<IQuestionAnswered[]>>;
  questionsAnswered: IQuestionAnswered[];
  index: number;
  disable?: boolean;
}

export default function UpdateChoiceQuestion({
  handleNext,
  questionData,
  questionsAnswered,
  setQuestionsAnswered,
  activeStep,
  handleBack,
  maxSteps,
  index,
  disable,
}: IProps) {
  const [answersSelected, setAnswersSelected] = useState<string[]>([]);
  const handleClick = async () => {
    if (answersSelected.length === 0) {
      toast.error("Please select at least one option");

      return;
    }

    const answers = [...questionsAnswered];
    answers[index] = { question: questionData.title, answers: answersSelected };
    setQuestionsAnswered(answers);
    handleNext(answers);
  };

  useEffect(() => {
    if (questionsAnswered.length === 0) {
      setAnswersSelected([]);
    } else {
      if (questionsAnswered[index])
        if (questionsAnswered[index].answers) setAnswersSelected([...questionsAnswered[index].answers]);
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
            {activeStep > 0 && (
              <Box
                sx={{
                  position: "relative",
                  marginBottom: "20px",
                }}
              >
                <Button
                  variant="text"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    padding: 0,
                    color: "inherit",
                  }}
                  onClick={handleBack}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "10px",
                      "@media screen and (max-width: 767px)": {
                        top: "-10px",
                      },
                    }}
                  >
                    <ArrowBackIosIcon style={{ marginRight: "0px" }} />
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: "normal",
                        whiteSpace: "nowrap",
                        textTransform: "capitalize",
                      }}
                    >
                      Go Back
                    </Typography>
                  </Box>
                </Button>
              </Box>
            )}
            <QuestionCardTitle title={questionData.title} description="Choose from the options below" />

            <Grid
              container
              spacing={2}
              sx={{
                "@media screen and (max-width: 767px)": {
                  display: "flex",
                  flexDirection: "column",
                },
              }}
            >
              {questionData.answers.map((option, i) => (
                <CheckBoxSelect
                  key={i}
                  title={questionData.answers[i]}
                  value={questionData.answers[i]}
                  setState={setAnswersSelected}
                  state={answersSelected}
                  disable={disable}
                />
              ))}
            </Grid>

            <Stack
              sx={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: "50px",
                "@media screen and (max-width: 767px)": {
                  flexDirection: "column",
                  gap: "10px",
                },
              }}
            >
              <SlideProgressBar activeStep={activeStep} maxSteps={maxSteps} />

              <Box
                sx={{
                  flex: "1",
                  textAlign: "right",
                  "@media screen and (max-width: 767px)": {
                    display: "flex",
                    width: "100%",
                    justifyContent: "end",
                  },
                }}
              >
                <Stack direction="row" justifyContent="flex-end" alignItems="center">
                  <Button
                    variant="contained"
                    disabled={answersSelected.length === 0 || disable}
                    sx={{ marginLeft: "30px" }}
                    onClick={handleClick}
                  >
                    {activeStep + 1 === maxSteps ? "Submit" : "Next"}
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
