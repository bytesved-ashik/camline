import * as React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

interface IProps {
  label: string;
  onChange: (value: Dayjs | null) => void;
  value: Dayjs | null | string;
}

export default function CustomTimePicker({ label, onChange, value }: IProps) {
  const day = dayjs(value);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker label={label} onChange={onChange} value={day} ampm={false} />
    </LocalizationProvider>
  );
}
