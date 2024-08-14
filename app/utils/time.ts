import { Duration } from "luxon";

// able to group by a nested value of a singular object or by an array of primitice values
export const getFormatedDuration = (
  totalSeconds: number,
  hideHours?: boolean
) => {
  const duration = Duration.fromObject({ seconds: totalSeconds });

  const format = hideHours ? "mm:ss" : "hh:mm:ss";
  // Format the duration to "mm:ss" format
  const formattedTime = duration.toFormat(format);

  return formattedTime;
};
