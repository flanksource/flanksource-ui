import { HealthCheck } from "../../api/types/health";
import { isEmpty } from "./utils";

export function CanarySorter(check: Partial<HealthCheck>) {
  return GetName(check).toLowerCase();
}

export function GetName(check: Partial<HealthCheck>) {
  let title = check.name;
  if (isEmpty(title)) {
    title = check.description;
  }
  if (isEmpty(title)) {
    title = check.endpoint;
  }
  return title || "";
}
