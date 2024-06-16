import { Icon } from "../Icons/Icon";

export default function Admonition({
  text,
  icon = "info",
  type = "info",
  className = ""
}: {
  text: string;
  icon?: string;
  type?: "info" | "warning";
  className?: string;
}) {
  return (
    <div className={`admonition ${type} ${className}`} role="alert">
      <span className="block sm:inline">
        {icon && <Icon name={icon} className="h-6 w-auto pr-2" />}
        {text}
      </span>
    </div>
  );
}
