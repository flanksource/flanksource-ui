import { format } from "timeago.js";
import { Badge } from "../Badge";
import { Icon } from "../Icon";
import { DescriptionCard } from "../DescriptionCard";
import { Table } from "../Table";
import { isEmpty } from "./utils";
import { Status } from "../Status";

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
  return (
    <>
      <span className="text-md">{val}</span>
      <span className="text-gray-500 text-light text-xs ml-0.5">{unit}</span>
    </>
  );
}

export function Labels({ labels }) {
  if (labels == null) {
    return null;
  }
  const items = [];
  for (const k in labels) {
    if (labels[k] === "true") {
      items.push(
        <div key={`${k}`}>
          <Badge text={k} />{" "}
        </div>
      );
    } else {
      items.push(
        <div key={`${k}-${labels[k]}`}>
          <Badge text={`${k}: ${labels[k]}`} />{" "}
        </div>
      );
    }
  }
  return items;
}

export function Latency({ check }) {
  if (check == null || check.latency == null) {
    return empty;
  }
  if (isEmpty(check.latency.rolling1h)) {
    return "";
  }
  return <Duration ms={check.latency.rolling1h} />;
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

export function Title({ icon, title, ...rest }) {
  return (
    <span {...rest}>
      {icon && (
        <span className="w-6 flex-shrink-0 mr-2">
          <Icon name={icon} className="inline" size="xl" />
        </span>
      )}
      <span className="text-sm">{title}</span>
    </span>
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

export function CanaryDescription({ check: incoming }) {
  const check =
    incoming?.pivoted === true
      ? incoming[incoming.valueLookup] ?? null
      : incoming;
  const statii = check.checkStatuses != null ? check.checkStatuses : [];
  const data = [];
  statii.forEach((status) => {
    data.push({
      key: `${check.key}.${check.description}`,
      age: format(`${status.time} UTC`),
      message: (
        <>
          <CanaryStatus status={status} /> {status.message}{" "}
          {!isEmpty(status.error) &&
            status.error.split("\n").map((item) => (
              <>
                {item}
                <br />
              </>
            ))}
        </>
      ),
      duration: <Duration ms={status.duration} />
    });
  });

  const items = [
    {
      key: `${check.key}name`,
      name: "Name",
      value: (
        <span>
          {check.namespace}/{check.name}
        </span>
      )
    },
    {
      key: `${check.key}namespace`,
      name: "Namespace",
      value: <Badge text={check.namespace} />
    },
    {
      key: `${check.key}latency`,
      name: "Latency",
      value: <Latency check={check} />
    },
    {
      key: `${check.key}uptime`,
      name: "Uptime",
      value: <Uptime check={check} />
    },
    {
      key: `${check.key}owner`,
      name: "Owner",
      value: check.owner
    },
    {
      key: `${check.key}severity`,
      name: "Severity",
      value: check.severity
    },
    {
      key: `${check.key}labels`,
      name: "Labels",
      value: <Labels labels={check.labels} />
    },
    {
      key: `${check.key}runner`,
      name: "Runner",
      value: <Labels labels={check.runnerLabels} />
    },

    {
      key: `${check.key}interval`,
      name: "Interval",
      value: check.interval > 0 ? check.interval : check.schedule
    },
    {
      key: `${check.key}type`,
      name: "Type",
      value: check.type
    },
    {
      key: `${check.key}endpoint`,
      name: "Endpoint",
      value: check.endpoint,
      colspan: 2
    },
    {
      key: `${check.key}checks`,
      name: "Checks",
      value: (
        <Table
          id={`${check.key}-table`}
          data={data}
          columns={["Age", "Duration", "Message"]}
        />
      ),
      colspan: 2
    }
  ];
  return <DescriptionCard items={items} />;
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
