import { ConfigChange } from "@flanksource-ui/api/types/configs";
import { configChangeSeverity } from "@flanksource-ui/components/Configs/Changes/ConfigChangesFilters/ConfigChangeSeverity";
import clsx from "clsx";
import { useMemo } from "react";
import { Icon } from "./Icon";
import { DotIcon } from "lucide-react";
import { FaDotCircle } from "react-icons/fa";

export function severityColorClass(severity?: string): string {
  const item = Object.values(configChangeSeverity).find(
    (i) => i.value === severity
  );
  return item?.colorClass ?? "";
}

interface ChangeIconProps {
  change?: Pick<ConfigChange, "change_type" | "severity">;
  className?: string;
  name?: string;
}

export function ChangeIcon({
  className = "w-5 h-auto",
  name,
  change
}: ChangeIconProps) {
  const colorClass = useMemo(
    () => severityColorClass(change?.severity),
    [change?.severity]
  );

  const iconName = change?.change_type || name;

  return (
    <Icon
      name={iconName}
      fallback={<FaDotCircle />}
      className={clsx("opacity-50", className, colorClass)}
    />
  );
}
