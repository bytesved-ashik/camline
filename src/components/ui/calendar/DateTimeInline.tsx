// ** React Imports
import { useState } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";

import DatePickerWrapper from "src/@core/styles/libs/react-datepicker";
import DatePicker, { ReactDatePickerProps } from "react-datepicker";

import setMinutes from "date-fns/setMinutes";
import setHours from "date-fns/setHours";

// ** Types
import { DateType } from "./reactDatepickerTypes";

const DateTimeInline = ({ popperPlacement }: { popperPlacement: ReactDatePickerProps["popperPlacement"] }) => {
  // ** States
  const [time, setTime] = useState<DateType>(setHours(setMinutes(new Date(), 0), 2));

  return (
    <DatePickerWrapper sx={{ "& .react-datepicker-wrapper": { width: "auto" } }}>
      <Box sx={{ display: "flex" }}>
        <DatePicker
          showTimeSelect
          selected={time}
          id="include-time"
          dateFormat="MM/dd/yyyy h:mm aa"
          popperPlacement={popperPlacement}
          onChange={(date: Date) => setTime(date)}
          inline
        />
      </Box>
    </DatePickerWrapper>
  );
};

export default DateTimeInline;
