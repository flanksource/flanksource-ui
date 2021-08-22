import { Duration, is_empty } from "./utils";
import Icon from "../Icon";
import { Percentage } from "./utils";

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
  var title = check.description;
  if (is_empty(title)) {
    title = check.endpoint;
  } else if (is_empty(title)) {
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
  if (is_empty(check.latency.rolling1h)) {
    return "";
  }
  return <Duration ms={check.latency.rolling1h} />;
}
