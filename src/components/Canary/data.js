import { isEmpty } from "./utils";

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
