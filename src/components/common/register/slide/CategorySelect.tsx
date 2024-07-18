import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import QuestionCardTitle from "./QuestionCardTitle";
import { getCategories } from "@/services/category.service";
import { Category } from "@/types/interfaces/category.interface";
import SlideProgressBar from "./SlideProgressBar";
import PeopleIcon from "@mui/icons-material/SupervisedUserCircle";
import CheckBoxSelect from "./CheckBoxSelect";
import { Dispatch, SetStateAction } from "react";
import * as toast from "@/utils/toast";
import { ROLE } from "@/enums/role.enums";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Icon from "src/@core/components/icon";
import QuestionSkeletonCard from "./QuestionSkeletonCard";

const categorySelectData = [
  {
    role: ROLE.THERAPIST,
    title: "What type of services are you accredited to deliver?",
  },
  {
    role: ROLE.USER,
    title: "What type of therapy are you looking for?",
  },
];

interface IProps {
  handleNext: () => void;
  handleBack: () => void;
  maxSteps: number;
  activeStep: number;
  role: string;
  setCategories: Dispatch<SetStateAction<string[]>>;
  categories: string[];
  isBack?: boolean;
  selectedCategory?: Category[];
  disable?: boolean;
}

export default function CategorySelect({
  handleNext,
  handleBack,
  maxSteps,
  activeStep,
  role,
  setCategories,
  categories,
  isBack,
  selectedCategory,
  disable,
}: IProps) {
  const [categoriesData, setCategoriesData] = useState<Category[]>([]);

  const getAllCategories = async () => {
    const data = await getCategories();
    setCategoriesData(data);
  };

  useEffect(() => {
    if (selectedCategory) {
      const cat: any = selectedCategory.map((val) => val._id);
      setCategories(cat);
    }
  }, [selectedCategory, categoriesData]);

  useEffect(() => {
    getAllCategories();
  }, []);

  const handleClick = () => {
    if (categories.length === 0) {
      toast.error("Please select at least one option");

      return;
    }
    handleNext();
  };

  if (categoriesData.length === 0) {
    return <QuestionSkeletonCard />;
  }

  return (
    <>
      <Box sx={{ margin: { xs: "0 auto", lg: "10% auto" }, maxWidth: "900px" }}>
        <Paper elevation={8} sx={{ margin: "auto" }}>
          <Box sx={{ padding: "40px 50px" }}>
            {isBack ? (
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
            ) : null}
            {categorySelectData.map((data, i) => (
              <>
                {role === data.role && (
                  <QuestionCardTitle key={i} title={data.title} description="Choose from the options below" />
                )}
              </>
            ))}
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
              {categoriesData.map((categorie, i) => (
                <CheckBoxSelect
                  key={i}
                  title={categorie.name}
                  value={categorie._id}
                  setState={setCategories}
                  state={categories}
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

              <Box sx={{ flex: "1", textAlign: "right" }}>
                <Stack direction="row" justifyContent="flex-end" alignItems="center">
                  <Box
                    sx={{
                      background: "linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #666CFF",
                      marginRight: "10px",
                      width: "37px",
                      height: "37px",
                      borderRadius: "100px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {role === ROLE.THERAPIST && <Icon icon="material-symbols:physical-therapy" color="#546FFF" />}
                    {role === ROLE.USER && <PeopleIcon sx={{ color: "#546FFF" }} />}
                  </Box>
                  <Typography sx={{ color: "#546FFF", fontWeight: "700", textTransform: "capitalize" }}>{role}</Typography>
                  <Button
                    variant="contained"
                    disabled={categories.length === 0}
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
