import React, { useEffect } from "react";
import { enGB } from "date-fns/locale";
import { DateRangePicker } from "react-nice-dates";
import "react-nice-dates/build/style.css";
import { Input } from "@mui/material";
import moment from "moment";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

type IProps = {
  onDateSelect: (startDate: any, endDate: any) => void;
  startDate: any;
  endDate: any;
  setStartDate: any;
  setEndDate: any;
  onClear: () => void;
};
export default function DateRangeSelector({ onDateSelect, setEndDate, setStartDate, startDate, endDate, onClear }: IProps) {
  useEffect(() => {
    if (startDate && endDate) {
      const sDate = startDate;
      const eDate = endDate;
      onDateSelect(moment(sDate).format("YYYY-MM-DD"), moment(eDate).format("YYYY-MM-DD"));
    }
  }, [startDate, endDate]);

  return (
    <>
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        minimumLength={1}
        format="dd MMM yyyy"
        locale={enGB}
        maximumDate={new Date()}
      >
        {({ startDateInputProps, endDateInputProps }: any) => (
          <div className="date-range">
            <Input {...startDateInputProps} placeholder="Start date" />
            <span className="date-range_arrow" />
            <Input {...endDateInputProps} placeholder="End date" />
          </div>
        )}
      </DateRangePicker>
      {startDate && endDate && <HighlightOffIcon onClick={onClear} />}
    </>
  );
}
