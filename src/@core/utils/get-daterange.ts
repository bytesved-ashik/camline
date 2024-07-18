import { format, differenceInDays, addDays } from "date-fns";

export const getDateRange = (startDate: Date, endDate: Date) => {
  const days = differenceInDays(endDate, startDate);

  /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
  /* @ts-ignore */
  return [...Array(days + 1).keys()].map((i) => format(addDays(startDate, i), "MM/dd/yyyy"));
};
