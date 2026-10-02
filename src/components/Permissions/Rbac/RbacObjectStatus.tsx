import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@flanksource-ui/components/ui/tooltip";
import { RbacStoredObject } from "@flanksource-ui/api/types/rbacResources";

type RbacObjectStatusProps = Pick<RbacStoredObject, "error" | "error_reason">;

// An object can be stored but not in effect, e.g. a Role whose Scope doesn't exist yet.
// It takes effect without being re-applied once what it references fits.
export function RbacObjectStatus({
  error,
  error_reason
}: RbacObjectStatusProps) {
  if (!error) {
    return (
      <span className="inline-flex items-center rounded bg-green-100 px-1.5 py-0.5 text-xs text-green-800">
        Active
      </span>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex cursor-help items-center rounded bg-red-100 px-1.5 py-0.5 text-xs text-red-800">
          Not in effect
        </span>
      </TooltipTrigger>
      <TooltipContent side="right" className="max-w-sm bg-slate-900 text-white">
        <div className="space-y-1 text-xs">
          {error_reason && <div className="font-semibold">{error_reason}</div>}
          <div className="text-gray-200">{error}</div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

export function RbacObjectNotInEffect({
  error,
  error_reason
}: RbacObjectStatusProps) {
  if (!error) {
    return null;
  }

  return (
    <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-900">
      <p className="font-medium">
        Not in effect{error_reason ? `: ${error_reason}` : ""}
      </p>
      <p>{error}</p>
    </div>
  );
}
