import { Duration, isEmpty, Percentage } from "./utils";
import { Icon } from "../Icon";

export function Uptime({ check }) {
  if (check.uptime == null) {
    return "";
  }
  return (
    <Percentage
      upper={check.uptime.passed + check.uptime.failed}
      lower={check.uptime.passed}
    />
  );
}

export function CanarySorter(check) {
  return GetName(check).toLowerCase();
}

export function GetName(check) {
  let title = check.description;
  if (isEmpty(title)) {
    title = check.endpoint;
  } else if (isEmpty(title)) {
    title = check.name;
  }
  return title;
}

export function Title({ check, showIcon = true }) {
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

export function Latency({ check }) {
  if (check.latency == null) {
    return "";
  }
  if (isEmpty(check.latency.rolling1h)) {
    return "";
  }
  return <Duration ms={check.latency.rolling1h} />;
}
