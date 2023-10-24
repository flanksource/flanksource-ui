import dayjs from "dayjs";
import clsx from "clsx";

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
  if (
    from === "" ||
    from == null ||
    dayjs(from).isSame(dayjs("0001-01-01T00:00:00+00:00"))
  ) {
    return null;
  }
  let _from = dayjs.utc(from);

  if (to == null) {
    return (
      <span title={_from.format()} className={className}>
        {_from.local().fromNow(!suffix)}
      </span>
    );
  }
  let _to = dayjs.utc(to);

  return (
    <span className={clsx(className, "whitespace-nowrap")}>
      {_from.local().to(_to)}
    </span>
  );
}
