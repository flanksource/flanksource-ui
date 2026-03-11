import React from "react";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@flanksource-ui/components/ui/tooltip";
import { cn } from "@flanksource-ui/lib/utils";

interface PanelHeaderProps {
  title: React.ReactNode;
  description?: string;
  className?: string;
  titleClassName?: string;
}

const PanelHeader: React.FC<PanelHeaderProps> = ({
  title,
  description,
  className,
  titleClassName
}) => {
  return (
    <div className={cn("mb-2 flex items-center gap-1.5", className)}>
      <h4 className={cn("text-sm font-medium text-gray-600", titleClassName)}>
        {title}
      </h4>

      {description ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              aria-label="Show panel description"
              className="inline-flex h-4 w-4 items-center justify-center text-gray-400 transition-colors hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Info className="h-3.5 w-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            className="max-w-xs whitespace-pre-wrap break-words bg-slate-900 text-white"
          >
            {description}
          </TooltipContent>
        </Tooltip>
      ) : null}
    </div>
  );
};

export default PanelHeader;
