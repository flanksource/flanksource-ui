import dayjs from "dayjs";
import { HealthCheck } from "../../../../api/types/health";

export function calculateDefaultTimeRangeValue(
  validCheck: Pick<Partial<HealthCheck>, "lastRuntime"> | undefined
) {
  // get time passed since last runtime
  const lapsedTime = dayjs(validCheck?.lastRuntime!).diff(dayjs(), "minute");
  console.log("lapsedTime", lapsedTime);
  // if passed time is less than 1 hour, use 1 hour time range
  if (lapsedTime < 60) {
    return "1h";
  }
  // if passed time is less than 3 hours, use 3 hours time range
  if (lapsedTime < 180) {
    return "3h";
  }

  // if passed time is less than 6 hours, use 6 hours time range
  if (lapsedTime < 360) {
    return "6h";
  }

  // if passed time is less than 12 hours, use 12 hours time range
  if (lapsedTime < 720) {
    return "12h";
  }

  // if passed time is less than 1 day, use 1 day time range
  if (lapsedTime < 1440) {
    return "1d";
  }

  // if passed time is less than 2 days, use 2 days time range
  if (lapsedTime < 2880) {
    return "2d";
  }

  // if passed time is less than 3 days, use 3 days time range
  if (lapsedTime < 4320) {
    return "3d";
  }

  // if passed time is less than 1 week, use 1 week time range
  if (lapsedTime < 10080) {
    return "1w";
  }

  // if passed time is less than 2 weeks, use 2 weeks time range
  if (lapsedTime < 20160) {
    return "2w";
  }

  // if passed time is less than 3 weeks, use 3 weeks time range
  if (lapsedTime < 30240) {
    return "3w";
  }

  // if passed time is less than 1 month, use 1 month time range
  if (lapsedTime < 43200) {
    return "1mo";
  }

  // if passed time is less than 2 months, use 2 months time range
  if (lapsedTime < 86400) {
    return "2mo";
  }

  // if passed time is less than 3 months, use 3 months time range
  if (lapsedTime < 129600) {
    return "3mo";
  }

  // if passed time is less than 6 months, use 6 months time range
  if (lapsedTime < 259200) {
    return "6mo";
  }

  // if passed time is less than 1 year, use 1 year time range
  if (lapsedTime < 525600) {
    return "1y";
  }

  // if passed time is less than 2 years, use 2 years time range
  if (lapsedTime < 1051200) {
    return "2y";
  }

  // if passed time is less than 3 years, use 3 years time range
  if (lapsedTime < 1576800) {
    return "3y";
  }

  // if passed time is more than 3 years, use 3 years time range
  if (lapsedTime > 1576800) {
    return "5y";
  }

  return "1h";
}
