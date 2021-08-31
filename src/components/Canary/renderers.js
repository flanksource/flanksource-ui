import { Badge } from "../Badge";
import { isEmpty } from "./utils";
import { Icon } from "../Icon";
import { GetName } from "./data";

export function Duration({ ms }) {
  if (ms == null || ms === 0) {
    return "";
  }
  try {
    ms = Number(ms);
  } catch (e) {
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
      <span className="text-lg">{val}</span>
      <span className="text-gray-500 text-light text-xs">{unit}</span>
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
  if ((isEmpty(lower) && isEmpty(val)) || (upper == 0 && lower == 0)) {
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
      <span className="text-lg" title={`${lower}/${upper}`}>
        {val}
      </span>
      <span className="text-gray-500 text-light text-xs">%</span>
    </>
  );
}

export function Title({ check, showIcon = true }) {
  if (check == null) {
    return <span className="bg-red-400" > null</span>
  }
  return (
    <>
      {showIcon && (
        <Icon
          name={check.icon ? check.icon : check.type}
          className="inline"
          size="xl"
        />
      )}
      {GetName(check)}
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
