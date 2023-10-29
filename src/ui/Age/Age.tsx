import dayjs from "dayjs";
import clsx from "clsx";

export function isEmpty(value: any): boolean {
  return (
    value === "" ||
    value == null ||
    dayjs(value).isSame(dayjs("0001-01-01T00:00:00+00:00"))
  );
}

export default function Age({
  className = "",
  from,
  to,
  suffix = false
}: {
  className?: string;
  from?: Date | string;
  to?: Date | string;
  suffix?: boolean;
}) {
  if (isEmpty(from)) {
    return null;
  }
  let _from = dayjs(from);

  if (isEmpty(to)) {
    return (
      <span title={_from.format()} className={className}>
        {_from.local().fromNow(!suffix)}
      </span>
    );
  }
  let _to = dayjs(to);

  let duration = dayjs.duration(_to.diff(_from));

  console.log(from, to, duration);
  if (duration.asMilliseconds() < 1000) {
    return (
      <span title={_from.format()} className={className}>
        {duration.asMilliseconds()}ms
      </span>
    );
  }

  return (
    <span className={clsx(className, "whitespace-nowrap")}>
      {_from.local().to(_to)}
    </span>
  );
}
