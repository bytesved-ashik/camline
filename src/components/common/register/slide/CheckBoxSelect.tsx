import { Button, Checkbox, FormControlLabel, Grid, TextField } from "@mui/material";
import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import * as toast from "@/utils/toast";

type IProps = {
  title: string;
  setState: Dispatch<SetStateAction<any>>;
  state: any;
  value: string;
  disable?: boolean;
};

export default function CheckBoxSelect({ title, value, setState, state, disable }: IProps) {
  const [isChecked, setIsChecked] = useState(false);
  const [isOtherdata, setIsOtherdata] = useState(false);
  const [othersFieldData, setOthersFieldData] = useState<string>("");

  const handleCheck = (event: ChangeEvent<HTMLInputElement>) => {
    let updatedList = [...state];
    if (event.target.checked) {
      updatedList = [...state, value];
    } else {
      updatedList.splice(state.indexOf(value), 1);
    }
    setIsChecked(!isChecked);
    if (value != "Other") {
      setState(updatedList);
    }
  };
  const handleOthersFieldData = () => {
    if (/^\s*$/.test(othersFieldData)) {
      toast.error("Please specify further ");

      return;
    }
    toast.success("Submitted");
    setIsOtherdata(true);
    setState([...state, othersFieldData]);
  };
  useEffect(() => {
    if (state.length === 0) {
      setIsChecked(false);
    } else {
      const index = state.findIndex((val: string) => val.includes(value));
      if (index > -1) {
        setIsChecked(true);
      }
    }
  }, [state]);

  return (
    <>
      <Grid item lg={6}>
        <Button
          variant="outlined"
          sx={{
            width: "100%",
            justifyContent: "flex-start",
            textTransform: "initial",
            minHeight: "78px",
            textAlign: "left",
            border: "1px solid  rgba(76, 78, 100, 0.22)",
            ":hover": {
              outline: "none",
            },
          }}
        >
          <FormControlLabel
            control={<Checkbox disabled={disable} checked={isChecked} onChange={handleCheck} />}
            label={isOtherdata ? othersFieldData : title}
          />
        </Button>
      </Grid>
      {value === "Other" && isChecked && !isOtherdata ? (
        <Grid item md={10} lg={12} mt={2} ml={1} display={"flex"}>
          <TextField
            label={"Please specify "}
            variant="standard"
            type="text"
            sx={{ mr: 3, width: "100%" }}
            onChange={(e) => setOthersFieldData(e.target.value)}
          />

          <Button onClick={handleOthersFieldData} variant="contained">
            Submit
          </Button>
        </Grid>
      ) : null}
    </>
  );
}
