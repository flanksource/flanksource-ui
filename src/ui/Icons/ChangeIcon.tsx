import { ConfigChange } from "@flanksource-ui/api/types/configs";
import { configChangeSeverity } from "@flanksource-ui/components/Configs/Changes/ConfigChangesFilters/ConfigChangeSeverity";
import clsx from "clsx";
import { useMemo } from "react";
import { Icon } from "./Icon";

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
  const colorClass = useMemo(() => {
    const items = Object.values(configChangeSeverity).find(
      (item) => item.value === change?.severity
    );
    return items?.colorClass ?? "";
  }, [change?.severity]);

  return (
    <Icon
      name={change?.change_type || name}
      className={clsx("opacity-50", className, colorClass)}
    />
  );
}
