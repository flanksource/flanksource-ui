import {
  RbacResource,
  RbacStoredObject,
  rbacResourceKinds
} from "@flanksource-ui/api/types/rbacResources";
import {
  toastError,
  toastSuccess
} from "@flanksource-ui/components/Toast/toast";

// A save succeeds even when the object isn't in effect, e.g. it references a missing Scope,
// so tell the user rather than reporting a plain success.
export function notifyRbacSaved(
  resource: RbacResource,
  verb: "created" | "updated",
  saved?: Pick<RbacStoredObject, "error">
) {
  const label = rbacResourceKinds[resource].label;
  if (saved?.error) {
    toastError(`${label} ${verb}, but isn't in effect: ${saved.error}`);
  } else {
    toastSuccess(`${label} ${verb}`);
  }
}
