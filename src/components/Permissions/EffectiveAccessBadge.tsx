import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@flanksource-ui/components/ui/tooltip";
import { Check, X } from "lucide-react";

type EffectiveAccessBadgeProps = {
  isAllowed: boolean;
};

export default function EffectiveAccessBadge({
  isAllowed
}: EffectiveAccessBadgeProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={
            isAllowed
              ? "inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"
              : "inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-50 text-red-600"
          }
        >
          {isAllowed ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <X className="h-3.5 w-3.5" />
          )}
        </span>
      </TooltipTrigger>
      <TooltipContent side="top">
        Effective access: {isAllowed ? "Allowed" : "Denied"}
      </TooltipContent>
    </Tooltip>
  );
}
