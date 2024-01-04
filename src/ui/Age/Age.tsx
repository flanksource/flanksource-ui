import dayjs from "dayjs";
import clsx from "clsx";
import { isEmpty } from "../../utils/date";

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
