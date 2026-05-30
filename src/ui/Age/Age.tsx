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
          <TooltipContent side="top" className="max-w-none p-0">
            <FullTimestampTooltip datetime={_from} />
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
          <TooltipContent side="top" className="max-w-none p-0">
            <FullTimestampTooltip datetime={_from} />
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
        <TooltipContent side="top" className="max-w-none p-0">
          <div className="w-[248px] space-y-1.5 rounded-md border border-white/20 bg-[#2b2b2b] p-2 text-white">
            <div>
              <div className="mb-1 text-[10px] uppercase tracking-wide text-zinc-400">
                From
              </div>
              <FullTimestampRows datetime={_from} />
            </div>
            <div className="border-t border-white/15 pt-1.5">
              <div className="mb-1 text-[10px] uppercase tracking-wide text-zinc-400">
                To
              </div>
              <FullTimestampRows datetime={_to} />
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

function FullTimestampTooltip({ datetime }: { datetime: dayjs.Dayjs }) {
  return (
    <div className="w-[248px] rounded-md border border-white/20 bg-[#2b2b2b] p-2 text-white">
      <FullTimestampRows datetime={datetime} />
    </div>
  );
}

function FullTimestampRows({ datetime }: { datetime: dayjs.Dayjs }) {
  const browserTimezoneOffset = datetime.local().format("Z");
  const browserTimestamp = datetime.local().format("YYYY-MM-DD HH:mm:ss");
  const utcTimestamp = datetime.tz("UTC").format("YYYY-MM-DD HH:mm:ss");

  return (
    <div className="space-y-1 text-xs">
      <div className="pb-1 text-zinc-100">{formatRelativeLong(datetime)}</div>
      <div className="flex items-center gap-1.5 font-mono">
        <span className="w-12 shrink-0 text-zinc-300">
          {browserTimezoneOffset}
        </span>
        <span>{browserTimestamp}</span>
      </div>
      <div className="flex items-center gap-1.5 font-mono">
        <span className="w-12 shrink-0 text-zinc-300">UTC</span>
        <span>{utcTimestamp}</span>
      </div>
    </div>
  );
}

function formatRelativeLong(datetime: dayjs.Dayjs) {
  const now = dayjs();
  const diffSeconds = datetime.diff(now, "second");
  const absSeconds = Math.abs(diffSeconds);

  const units: Array<{ unit: Intl.RelativeTimeFormatUnit; seconds: number }> = [
    { unit: "year", seconds: 365 * 24 * 60 * 60 },
    { unit: "month", seconds: 30 * 24 * 60 * 60 },
    { unit: "day", seconds: 24 * 60 * 60 },
    { unit: "hour", seconds: 60 * 60 },
    { unit: "minute", seconds: 60 },
    { unit: "second", seconds: 1 }
  ];

  const selected =
    units.find(({ seconds }) => absSeconds >= seconds) ??
    units[units.length - 1];
  const value = Math.round(diffSeconds / selected.seconds);

  return new Intl.RelativeTimeFormat("en", {
    numeric: "always",
    style: "long"
  }).format(value, selected.unit);
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
