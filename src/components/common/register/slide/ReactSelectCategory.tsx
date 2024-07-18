import { ROLE } from "@/enums/role.enums";
import { getCategories } from "@/services/category.service";
import { Typography } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Select from "react-select";

type IProps = {
  role: string | undefined;
  setSelectedCategories: Dispatch<SetStateAction<string[]>>;
  selectedCategories: string[];
};

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

export default function ReactSelectCategory({ role, selectedCategories, setSelectedCategories }: IProps) {
  const [categoriesData, setCategoriesData] = useState<{ label: string; value: string }[]>([]);
  const selectedOptions = categoriesData.filter((val) => selectedCategories.includes(val.value));

  const getAllCategories = async () => {
    const data = await getCategories();
    const cat: any = data.map((val) => {
      return { label: val.name, value: val._id };
    });
    setCategoriesData(cat);
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  return (
    <>
      {categorySelectData.map((data) => (
        <>
          {role === data.role && (
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
                {data.title}
              </Typography>
              <div style={{ width: "100%", marginBottom: "20px" }}>
                <Select
                  value={selectedOptions}
                  options={categoriesData}
                  isMulti
                  onChange={(val: any) => {
                    setSelectedCategories(val.map((v: any) => v.value));
                  }}
                  required
                />
              </div>
            </>
          )}
        </>
      ))}
    </>
  );
}
