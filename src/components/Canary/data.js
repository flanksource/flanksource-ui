import { isEmpty } from "./utils";

export function CanarySorter(check) {
  return GetName(check).toLowerCase();
}

export function GetName(check) {
  let title = check.name;
  if (isEmpty(title)) {
    title = check.description;
  }
  if (isEmpty(title)) {
    title = check.endpoint;
  }
  return title || "";
}
