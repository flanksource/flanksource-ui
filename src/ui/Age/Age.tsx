import clsx from "clsx";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import { Tooltip } from "react-tooltip";
import { isEmpty } from "../../utils/date";

export function formatDateForTooltip(data: dayjs.Dayjs) {
  return data.format("YYYY-MM-DD HH:mm:ssZ");
}

dayjs.extend(LocalizedFormat);

type AgeProps = {
  className?: string;
  from?: Date | string;
  to?: Date | string | null;
  suffix?: boolean;
  // duration handles null "to" time differently.
  displayType?: "age" | "duration";
};

export default function Age({
  className = "",
  from,
  to,
  suffix = false,
  displayType = "age"
}: AgeProps) {
  if (isEmpty(from)) {
    return null;
  }

  const _from = dayjs(from);

  if (isEmpty(to)) {
    return (
      <>
        <span
          data-tooltip-id={`age-tooltip-${_from.local().fromNow(!suffix)}`}
          className={className}
        >
          {displayType === "duration"
            ? "Indefinitely"
            : _from.local().fromNow(!suffix)}
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
