import { formatDuration } from "@flanksource-ui/utils/date";
import dayjs from "dayjs";

type FormatDurationProps = {
  startTime?: string;
  endTime?: string;
};

export default function FormatDuration({
  startTime,
  endTime
}: FormatDurationProps) {
  if (!startTime || !endTime) {
    return null;
  }

  const duration = dayjs(endTime).diff(dayjs(startTime), "milliseconds");

  const formattedDuration = formatDuration(duration);

  return <span>{formattedDuration}</span>;
}
