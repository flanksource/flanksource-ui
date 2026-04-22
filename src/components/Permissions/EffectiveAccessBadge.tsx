import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@flanksource-ui/components/ui/tooltip";
import { Check, X } from "lucide-react";

type EffectiveAccessBadgeProps =
  | {
      state: "allowed" | "denied" | "unknown";
      unknownReason?: string;
    }
  | {
      isAllowed: boolean;
    };

export default function EffectiveAccessBadge(props: EffectiveAccessBadgeProps) {
  const state =
    "state" in props ? props.state : props.isAllowed ? "allowed" : "denied";

  if (state === "unknown") {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-50 text-[11px] font-semibold leading-none text-amber-700">
            ?
          </span>
        </TooltipTrigger>
        <TooltipContent>
          {("unknownReason" in props && props.unknownReason) ||
            "Effective access evaluation failed for this cell."}
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <span
      className={
        state === "allowed"
          ? "inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"
          : "inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-50 text-red-600"
      }
    >
      {state === "allowed" ? (
        <Check className="h-3.5 w-3.5" />
      ) : (
        <X className="h-3.5 w-3.5" />
      )}
    </span>
  );
}
