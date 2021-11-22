import { Badge } from "../Badge";
import { isEmpty } from "./utils";
import { Icon } from "../Icon";

export function Duration({ ms }) {
  if (ms == null || ms === 0) {
    return "";
  }
  try {
    ms = Number(ms);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("invalid number format", ms);
    return "";
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
    return "";
  }
  if (isEmpty(check.latency.rolling1h)) {
    return "";
  }
  return <Duration ms={check.latency.rolling1h} />;
}

export function Percentage({ val, upper, lower }) {
  const empty = <span className="text-gray-500 text-light text-xs">-</span>;
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

export function Title({ icon, title }) {
  return (
    <>
      {icon && (
        <span className="w-6 flex-shrink-0 mr-2">
          <Icon name={icon} className="inline" size="xl" />
        </span>
      )}
      <span className="text-sm">{title}</span>
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
