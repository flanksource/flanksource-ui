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

export function removeNamespacePrefix(name, check) {
  if (check.namespaces?.length > 0) {
    const split = name.split("/");
    if (split.length > 1 && check.namespaces.includes(split[0])) {
      return split.slice(1).join("/");
    }
    return name;
  }
  if (check.namespace) {
    const split = name.split("/");
    if (split.length > 1 && check.namespace === split[0]) {
      return split.slice(1).join("/");
    }
    return name;
  }
  return name;
}
