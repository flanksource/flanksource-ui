import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@flanksource-ui/components/ui/tooltip";
import type { ReactElement, ReactNode } from "react";
import { formatExactAICost } from "./cost";

type AICostTooltipProps = {
  children: ReactElement;
  cost: number;
  details?: ReactNode;
};

export function AICostTooltip({ children, cost, details }: AICostTooltipProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side="top" className="max-w-none">
          <div className="space-y-1">
            <div>
              Cost: <span className="font-mono">{formatExactAICost(cost)}</span>
            </div>
            {details && <div className="text-gray-300">{details}</div>}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
