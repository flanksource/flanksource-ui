import { ConfigChange } from "@flanksource-ui/api/types/configs";
import {
  HoverCard,
  HoverCardTrigger
} from "@flanksource-ui/components/ui/hover-card";
import { PortaledHoverCardContent as HoverCardContent } from "@flanksource-ui/components/ui/portaled-hover-card";
import { CircleAlert, Info, OctagonAlert, TriangleAlert } from "lucide-react";
import { SeverityCounts, filterBySeverity } from "./Utils";
import { SeverityTooltip } from "./SeverityTooltip";

const severityEntries: { key: keyof SeverityCounts; icon: React.ReactNode }[] =
  [
    {
      key: "critical",
      icon: <OctagonAlert className="h-4 w-4 text-red-600" />
    },
    { key: "high", icon: <CircleAlert className="h-4 w-4 text-red-500" /> },
    {
      key: "medium",
      icon: <TriangleAlert className="h-4 w-4 text-orange-500" />
    },
    { key: "low", icon: <Info className="h-4 w-4 text-orange-400" /> },
    { key: "info", icon: <Info className="h-4 w-4 text-blue-400" /> }
  ];

export function SeverityBadges({
  severity,
  changes,
  onExpand
}: {
  severity: SeverityCounts;
  changes: ConfigChange[];
  onExpand: (change: ConfigChange) => void;
}) {
  const visible = severityEntries.filter(({ key }) => severity[key] > 0);
  if (visible.length === 0) return null;

  return (
    <div className="flex shrink-0 items-center gap-1">
      {visible.map(({ key, icon }) => {
        const matched = filterBySeverity(changes, key);
        return (
          <HoverCard key={key} openDelay={200} closeDelay={100}>
            <HoverCardTrigger asChild>
              <span className="relative inline-flex cursor-pointer items-center">
                {icon}
                {severity[key] > 1 && (
                  <span className="absolute -right-1.5 -top-1 flex h-3 min-w-3 items-center justify-center rounded-full bg-zinc-400 px-0.5 text-[8px] font-light leading-none text-white">
                    {severity[key]}
                  </span>
                )}
              </span>
            </HoverCardTrigger>
            <HoverCardContent
              side="bottom"
              align="start"
              collisionPadding={16}
              className="w-fit min-w-56 max-w-lg p-0"
            >
              <SeverityTooltip
                changes={matched}
                severityKey={key}
                onExpand={onExpand}
              />
            </HoverCardContent>
          </HoverCard>
        );
      })}
    </div>
  );
}
