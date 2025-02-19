import clsx from "clsx";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import TimezonePlugin from "dayjs/plugin/timezone";
import { Tooltip } from "react-tooltip";
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
    return (
      <>
        <span
          data-tooltip-id={`age-tooltip-${_from.local().fromNow(!suffix)}`}
          className={className}
        >
          {formattedDate}
        </span>

        {datetimePreference !== "timestamp" && (
          <Tooltip
            id={`age-tooltip-${_from.local().fromNow(!suffix)}`}
            content={formatDateForTooltip(_from, displayTimezonePreference)}
          />
        )}
      </>
    );
  }

  const _to = dayjs(to);

  const duration = dayjs.duration(_to.diff(_from));

  if (duration.asMilliseconds() < 1000) {
    return (
      <>
        <span
          data-tooltip-id={`age-tooltip-${duration.asMilliseconds()}`}
          className={className}
        >
          {duration.asMilliseconds()}ms
        </span>
        <Tooltip
          id={`age-tooltip-${duration.asMilliseconds()}`}
          content={`${formatDateForTooltip(_from, displayTimezonePreference)}`}
        />
      </>
    );
  }

  return (
    <>
      <span
        data-tooltip-id={`age-tooltip-${_from.local().to(_to)}`}
        className={clsx(className, "whitespace-nowrap")}
      >
        {_from.local().to(_to, !suffix)}
      </span>
      <Tooltip
        id={`age-tooltip-${_from.local().to(_to)}`}
        content={`${formatDateForTooltip(_from, displayTimezonePreference)} - ${formatDateForTooltip(_to, displayTimezonePreference)}`}
      />
    </>
  );
}

export function formatDateForTooltip(
  datetime: dayjs.Dayjs,
  displayTimezone: string = "Browser"
) {
  return formatDayjs(datetime, displayTimezone, "timestamp", false);
}

function formatDayjs(
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
