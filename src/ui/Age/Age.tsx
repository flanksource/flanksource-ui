import clsx from "clsx";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import TimezonePlugin from "dayjs/plugin/timezone";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@flanksource-ui/components/ui/tooltip";
import { isEmpty } from "../../utils/date";
import {
  datetimePreferenceAtom,
  displayTimezonePreferenceAtom
} from "@flanksource-ui/store/preference.state";
import { useAtomValue } from "jotai";

dayjs.extend(LocalizedFormat);
dayjs.extend(TimezonePlugin);

type AgeProps = {
  className?: string;
  from?: Date | string;
  to?: Date | string | null;
  suffix?: boolean;
  format?: "short" | "medium" | "full" | "timestamp";
};

export default function Age({
  className = "",
  from,
  to,
  suffix = false,
  format = undefined
}: AgeProps) {
  // TODO: Do we need to memoize this ...
  let datetimePreference = useAtomValue(datetimePreferenceAtom);
  const displayTimezonePreference = useAtomValue(displayTimezonePreferenceAtom);
  if (format) {
    datetimePreference = format;
  }

  if (isEmpty(from)) {
    return null;
  }

  const _from = dayjs(from);

  if (isEmpty(to)) {
    const formattedDate = formatDayjs(
      _from,
      displayTimezonePreference,
      datetimePreference,
      suffix
    );

    if (datetimePreference === "timestamp") {
      return <span className={className}>{formattedDate}</span>;
    }

    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className={className}>{formattedDate}</span>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-none">
            {getFullTimestampTooltip(_from)}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  const _to = dayjs(to);

  const duration = dayjs.duration(_to.diff(_from));

  if (duration.asMilliseconds() < 1000) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className={className}>{duration.asMilliseconds()}ms</span>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-none">
            {getFullTimestampTooltip(_from)}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={clsx(className, "whitespace-nowrap")}>
            {_from.local().to(_to, !suffix)}
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-none">
          <div className="space-y-2">
            <div>
              <div className="font-medium">From</div>
              {getFullTimestampTooltip(_from)}
            </div>
            <div>
              <div className="font-medium">To</div>
              {getFullTimestampTooltip(_to)}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function formatDateForTooltip(
  datetime: dayjs.Dayjs,
  displayTimezone: string = "Browser"
) {
  return formatDayjs(datetime, displayTimezone, "timestamp", false);
}

function getFullTimestampTooltip(datetime: dayjs.Dayjs) {
  const browserTimezoneOffset = datetime.local().format("Z");
  const browserTimestamp = datetime.local().format("YYYY-MM-DD HH:mm:ss");
  const utcTimestamp = datetime.tz("UTC").format("YYYY-MM-DD HH:mm:ss");

  return (
    <div className="space-y-1">
      <div>
        {browserTimestamp} {browserTimezoneOffset}
      </div>
      <div>{utcTimestamp} UTC</div>
    </div>
  );
}

export function formatDayjs(
  datetime: dayjs.Dayjs,
  displayTimezone: string,
  datetimePreference: "short" | "medium" | "full" | "timestamp",
  suffix: boolean
) {
  if (displayTimezone === "Browser") {
    datetime = datetime.local();
  } else {
    datetime = datetime.tz(displayTimezone);
  }

  switch (datetimePreference) {
    case "short":
      return datetime.fromNow(!suffix);

    case "medium":
      if (datetime.isSame(dayjs(), "day")) {
        return datetime.local().format("HH:mm:ss");
      } else if (datetime.isSame(dayjs(), "week")) {
        return datetime.format("ddd HH:mm:ss");
      } else if (datetime.isSame(dayjs(), "year")) {
        return datetime.format("MMM D HH:mm");
      } else {
        return datetime.format("MMM D YYYY HH:mm");
      }

    case "full":
      if (datetime.isSame(dayjs(), "year")) {
        return datetime.format("MMM D HH:mm:ss");
      }

      return datetime.format("MMM D YYYY HH:mm:ss");

    case "timestamp":
      return datetime.format("YYYY-MM-DD HH:mm:ss.SSS");
  }
}
