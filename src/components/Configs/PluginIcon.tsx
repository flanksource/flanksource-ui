import { Icon } from "@flanksource-ui/ui/Icons/Icon";
import dynamic from "next/dynamic";

const PluginLucideIcon = dynamic(() => import("./PluginLucideIcon"));

const LUCIDE_PREFIX = "lucide:";

type PluginIconProps = {
  name?: string;
  className?: string;
};

export function PluginIcon({ name, className = "h-4 w-4" }: PluginIconProps) {
  if (name?.startsWith(LUCIDE_PREFIX)) {
    return (
      <PluginLucideIcon
        name={name.slice(LUCIDE_PREFIX.length)}
        className={className}
      />
    );
  }

  return <Icon name={name || "puzzle"} className={className} />;
}
