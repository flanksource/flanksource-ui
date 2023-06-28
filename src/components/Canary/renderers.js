import { Icon } from "../Icon";
import { Status } from "../Status";
import { isEmpty } from "./utils";
import { TbTrash } from "react-icons/tb";

export const empty = (
  <span className="text-gray-500 text-light text-xs">-</span>
);

export function CanaryStatus({ status, className }) {
  if (status.mixed) {
    return <Status mixed={status.mixed} className={className} />;
  }
  return <Status good={status.status} className={className} />;
}

export function toFormattedDuration(ms) {
  if (ms == null || ms === 0) {
    return ["", ""];
  }
  try {
    ms = Number(ms);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("invalid number format", ms);
    return ["", ""];
  }
  let val;
  let unit;
  if (ms < 1000) {
    val = ms.toFixed();
    unit = "ms";
  } else if (ms < 1000 * 60) {
    val = ms / 1000;
    unit = "s";
  } else if (ms < 1000 * 60 * 60) {
    val = ms / 1000 / 60;
    unit = "m";
  } else {
    val = ms / 1000 / 60 / 6;
    unit = "h";
  }
  if (val != null && Math.round(val) !== val) {
    val = Number(val).toFixed(0);
  }
  return [val, unit];
}

export function Duration({ ms }) {
  const [val, unit] = toFormattedDuration(ms);
  if (!val && !unit) {
    return null;
  }
  return (
    <>
      <span className="text-md">{val}</span>
      <span className="text-gray-500 text-light text-xs ml-0.5">{unit}</span>
    </>
  );
}

export function Latency({ check }) {
  if (check == null || check.latency == null) {
    return empty;
  }
  if (isEmpty(check.latency.p95)) {
    return "";
  }
  return <Duration ms={check.latency.p95} />;
}

export function Percentage({ val, upper, lower }) {
  if ((isEmpty(lower) && isEmpty(val)) || (upper === 0 && lower === 0)) {
    return empty;
  }
  if (upper != null && lower != null) {
    val = (lower / upper) * 100;
  }

  if (val != null && Math.round(val) !== val) {
    try {
      val = Number(val).toFixed(1);
    } catch (e) {
      return empty;
    }
  }

  return (
    <>
      <span className="text-md" title={`${lower}/${upper}`}>
        {val}
      </span>
      <span className="text-gray-500 text-light text-xs ml-0.5">%</span>
    </>
  );
}

export function Title({ icon, title, isDeleted }) {
  return (
    <>
      {icon && (
        <span className="w-6 flex-shrink-0 mr-2">
          <Icon name={icon} className="inline h-6" />
        </span>
      )}
      <span className="text-sm">{title}</span> {isDeleted && <TbTrash />}
    </>
  );
}

export function Uptime({ check }) {
  if (check == null || check.uptime == null) {
    return "";
  }
  return (
    <Percentage
      upper={check.uptime.passed + check.uptime.failed}
      lower={check.uptime.passed}
    />
  );
}

export function StatusList({ check, checkStatuses }) {
  if (check && check.checkStatuses && check.checkStatuses.length > 0) {
    return (
      <>
        {check.checkStatuses.map((status, idx) => (
          // Can't think of stable keys for this
          // eslint-disable-next-line react/no-array-index-key
          <CanaryStatus key={idx} status={status} className="mr-0.5" />
        ))}
      </>
    );
  }
  if (checkStatuses && checkStatuses.length > 0) {
    return (
      <>
        {checkStatuses.map((status, idx) => (
          // Can't think of stable keys for this
          // eslint-disable-next-line react/no-array-index-key
          <CanaryStatus key={idx} status={status} className="mr-0.5" />
        ))}
      </>
    );
  }
  return empty;
}
