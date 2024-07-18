import { Box, Card, CardActionArea, CardContent, CardMedia, Grid, Paper, Typography } from "@mui/material";
import QuestionCardTitle from "./QuestionCardTitle";
import PeopleIcon from "@mui/icons-material/SupervisedUserCircle";
import { Dispatch, SetStateAction, useState } from "react";
import { ROLE } from "@/enums/role.enums";
import Icon from "src/@core/components/icon";

interface IProps {
  handleNext: () => void;
  setRole: Dispatch<SetStateAction<ROLE>>;
}
interface IRoleOption {
  title: string;
  role: ROLE;
  subTitle: string;
  icon: JSX.Element;
}

const roleOptionData: IRoleOption[] = [
  {
    title: "Therapist",
    role: "therapist",
    subTitle: "I am a therapist",
    icon: <Icon icon="material-symbols:physical-therapy" style={{ fontSize: "30px" }} />,
  },
  {
    title: "User",
    role: "user",
    subTitle: "I am looking for a therapist",
    icon: <PeopleIcon sx={{ fontSize: "30px" }} />,
  },
];

export default function GetStarted({ handleNext, setRole }: IProps) {
  const [hoveredIndex, setHoveredIndex] = useState(-1);

  return (
    <Box sx={{ margin: "auto", maxWidth: "900px" }}>
      <Paper elevation={8} sx={{ margin: "auto" }}>
        <QuestionCardTitle title="Let’s get started" description="How would you like to use this platform?" />
        <Box sx={{ padding: "40px 50px" }}>
          <Grid container spacing={2} justifyContent="center">
            {roleOptionData.map((option, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Card sx={{ boxShadow: "none", width: "101%", height: "17rem" }}>
                  <CardActionArea
                    sx={{
                      textAlign: "center",
                      padding: "16px",
                      "&:hover": {
                        border: "2px solid #7187ff",
                        borderRadius: "10px",
                        background: "#f8f8ff",
                      },
                    }}
                    onClick={() => {
                      handleNext();
                      setRole(option.role);
                    }}
                    onMouseOver={() => setHoveredIndex(i)}
                    onMouseOut={() => setHoveredIndex(-1)}
                  >
                    <CardMedia
                      sx={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "100%",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto",
                        background: "linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #666CFF",
                        color: "#546FFF",
                        fontSize: "30px",
                      }}
                    >
                      {option.icon}
                    </CardMedia>
                    <CardContent>
                      <Typography
                        sx={{
                          fontSize: "1.125rem",
                          color: i === hoveredIndex ? "#546fff" : "#606A7C",
                          letterSpacing: "0.15px",
                          lineHeight: "160%",
                          marginBottom: "7px",
                        }}
                      >
                        {option.title}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.965rem",
                          color: i === hoveredIndex ? "#546fff" : "#606A7C",
                          letterSpacing: "0.15px",
                          lineHeight: "150%",
                          marginBottom: "7px",
                        }}
                      >
                        {option.subTitle}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}
