export function getPercentage(uptime) {
  if (uptime == null) {
    return null;
  }
  if (uptime.passed + uptime.failed === 0) {
    return null;
  }
  return uptime.passed / (uptime.passed + uptime.failed);
}

export function isEmpty(val) {
  return val == null || val === "";
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
