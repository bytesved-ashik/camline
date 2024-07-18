import { IQuestionAnswered, IQuestionData } from "@/types/interfaces/authQuestions.interface";
import { Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import Select from "react-select";

type IProps = {
  questionData: IQuestionData;
  setQuestionsAnswered: Dispatch<SetStateAction<IQuestionAnswered[]>>;
  questionsAnswered: IQuestionAnswered[];
};

export default function QuistionsSelect({ questionData, setQuestionsAnswered, questionsAnswered }: IProps) {
  const index = questionsAnswered.findIndex((val) => val.question === questionData.title);
  let selectedAnswers: { label: string; value: string }[] = [];
  if (index > -1) {
    selectedAnswers = questionsAnswered[index].answers.map((val) => {
      return { label: val, value: val };
    });
  }

  const options: any = questionData.answers.map((val) => {
    return {
      label: val,
      value: val,
    };
  });

  return (
    <>
      <Typography
        sx={{
          textAlign: "left",
          fontWeight: "700",
          fontSize: "1rem",
          lineHeight: "133.4%",
          marginBottom: "12px",
          color: "text.black",
        }}
      >
        {questionData.title}
      </Typography>
      <div style={{ width: "100%", marginBottom: 20 }}>
        <Select
          styles={{
            menu: (baseStyles) => ({ ...baseStyles, zIndex: 1000 }),
          }}
          required
          value={selectedAnswers}
          options={options}
          isMulti
          onChange={(val: any) => {
            const qa: any = JSON.parse(JSON.stringify(questionsAnswered));

            const index = qa.findIndex((val: any) => val.question === questionData.title);
            if (index > -1) {
              qa[index] = { question: questionData.title, answers: val.map((v: any) => v.value) };
              setQuestionsAnswered(qa);

              return;
            }
            setQuestionsAnswered([...qa, { question: questionData.title, answers: val.map((v: any) => v.value) }]);
          }}
        />
      </div>
    </>
  );
}
