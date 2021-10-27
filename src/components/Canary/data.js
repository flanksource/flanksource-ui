import { isEmpty } from "./utils";

export function CanarySorter(check) {
  return GetName(check).toLowerCase();
}

export function GetName(check) {
  return isEmpty(check.name)
    ? isEmpty(check.endpoint)
      ? check.description
      : check.endpoint
    : check.name;
}
