// ABOUTME: Renders a Lucide icon by its kebab-case name (e.g. "scroll-text").
// ABOUTME: Lazy-loaded so the full Lucide icon set stays out of the main bundle.
import { icons } from "lucide-react";

type PluginLucideIconProps = {
  name: string;
  className?: string;
};

function toPascalCase(name: string): string {
  return name
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

export default function PluginLucideIcon({
  name,
  className
}: PluginLucideIconProps) {
  const LucideIcon = (
    icons as Record<string, React.ComponentType<{ className?: string }>>
  )[toPascalCase(name)];

  if (!LucideIcon) {
    return null;
  }

  return <LucideIcon className={className} />;
}
