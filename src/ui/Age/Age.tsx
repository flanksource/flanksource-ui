import clsx from "clsx";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import { Tooltip } from "react-tooltip";
import { isEmpty } from "../../utils/date";
import {
  datetimePreferenceAtom,
  DateTimePreferenceOptions
} from "@flanksource-ui/store/preference.state";
import { useAtomValue } from "jotai";

dayjs.extend(LocalizedFormat);

type AgeProps = {
  className?: string;
  from?: Date | string;
  to?: Date | string | null;
  suffix?: boolean;
};

export default function Age({
  className = "",
  from,
  to,
  suffix = false
}: AgeProps) {
  // TODO: Do we need to memoize this ...
  const datetimePreference = useAtomValue(datetimePreferenceAtom);

  if (isEmpty(from)) {
    return null;
  }

  const _from = dayjs(from);

  if (isEmpty(to)) {
    const formattedDate = formatDayjs(_from, datetimePreference, suffix);
    return (
      <>
        <span
          data-tooltip-id={`age-tooltip-${_from.local().fromNow(!suffix)}`}
          className={className}
        >
          {formattedDate}
        </span>
        <Tooltip
          id={`age-tooltip-${_from.local().fromNow(!suffix)}`}
          content={formatDateForTooltip(_from)}
        />
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
          content={`${formatDateForTooltip(_from)}`}
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
        content={`${formatDateForTooltip(_from)} - ${formatDateForTooltip(_to)}`}
      />
    </>
  );
}

export function formatDateForTooltip(datetime: dayjs.Dayjs) {
  return formatDayjs(datetime, DateTimePreferenceOptions.Timestamp, false);
}

function formatDayjs(
  datetime: dayjs.Dayjs,
  datetimePreference: DateTimePreferenceOptions,
  suffix: boolean
) {
  switch (datetimePreference) {
    case DateTimePreferenceOptions.Short:
      return datetime.fromNow(!suffix);

    case DateTimePreferenceOptions.Medium:
      if (datetime.isSame(dayjs(), "day")) {
        return datetime.local().format("HH:mm");
      } else if (datetime.isSame(dayjs(), "week")) {
        return datetime.format("ddd HH:mm");
      } else if (datetime.isSame(dayjs(), "year")) {
        return datetime.format("MMM D HH:mm");
      } else {
        return datetime.format("MMM D YYYY HH:mm");
      }

    case DateTimePreferenceOptions.Full:
      return datetime.format("MMM D HH:mm:ss.SSS");

    case DateTimePreferenceOptions.Timestamp:
      return datetime.format("YYYY-MM-DD HH:mm:ss.SSS Z");
  }
}
