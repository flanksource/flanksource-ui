import { TbTrash } from "react-icons/tb";
import { HealthCheck, HealthCheckStatus } from "../../api/types/health";
import { Icon } from "../../ui/Icons/Icon";
import { Status } from "../Status";
import { isEmpty } from "./utils";

export const empty = (
  <span className="text-gray-500 text-light text-xs">-</span>
);

type CheckStatusProps = {
  status: {
    good?: boolean;
    mixed?: boolean;
    status?: boolean;
  };
  className?: string;
};

export function CanaryStatus({ status, className }: CheckStatusProps) {
  if (status.mixed) {
    return <Status mixed={status.mixed} className={className} />;
  }
  return <Status good={status.status} className={className} />;
}

export function toFormattedDuration(ms: number) {
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
  if (val != null && Math.round(val as number) !== val) {
    val = Number(val).toFixed(0);
  }
  return [val, unit];
}

type DurationProps = {
  ms?: number;
};

export function Duration({ ms }: DurationProps) {
  const [val, unit] = toFormattedDuration(ms!);
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

type LatencyProps = {
  check?: Partial<HealthCheck>;
};

export function Latency({ check }: LatencyProps) {
  if (check == null || check.latency == null) {
    return empty;
  }
  if (isEmpty(check.latency.p95)) {
    return "";
  }
  return <Duration ms={check.latency.p95} />;
}

type PercentageProps = {
  val?: number;
  upper?: number;
  lower?: number;
};

export function Percentage({ val, upper, lower }: PercentageProps) {
  if ((isEmpty(lower) && isEmpty(val)) || (upper === 0 && lower === 0)) {
    return empty;
  }
  if (upper != null && lower != null) {
    val = (lower / upper) * 100;
  }

  if (val != null && Math.round(val) !== val) {
    try {
      // @ts-expect-error
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

type TitleProps = {
  icon?: string;
  title: string;
  isDeleted?: boolean;
};

export function Title({ icon, title, isDeleted }: TitleProps) {
  return (
    <>
      {icon && <Icon name={icon} className="h-6 w-auto" />}
      <span className="pl-1 text-sm">{title}</span> {isDeleted && <TbTrash />}
    </>
  );
}

type UptimeProps = {
  check?: HealthCheck;
};

export function Uptime({ check }: UptimeProps) {
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

type StatusListProps = {
  check?: HealthCheck;
  checkStatuses?: HealthCheckStatus[];
};

export function StatusList({ check, checkStatuses }: StatusListProps) {
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
