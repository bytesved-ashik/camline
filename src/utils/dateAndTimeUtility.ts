import { Dayjs } from "dayjs";

export function timeToDuration(time: Dayjs | null) {
  if (time) {
    const hour = time.hour();
    const minute = time.minute();
    if (!minute && !hour) return 0;
    if (!minute) return hour * 60;
    if (!hour) return minute;
    const duration = hour * 60 + minute;

    return duration;
  }

  return 0;
}
export function dateFormatter(date: Dayjs) {
  return new Date(date.format("YYYY-MM-DDTHH:mm:ss.SSSZ"));
}
