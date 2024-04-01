import { useMemo } from "react";
import { ConfigItem } from "../../api/types/configs";
import { Icon } from "../Icon";

export type ConfigIconProps = {
  config: Pick<ConfigItem, "type">;
  className?: string;
  showPrimaryIcon?: boolean;
  showSecondaryIcon?: boolean;
  showLabel?: boolean;
  children?: React.ReactNode;
};

export default function ConfigsTypeIcon({
  config,
  className = "w-5 h-auto",
  showPrimaryIcon = true,
  showSecondaryIcon = true,
  showLabel = false,
  children
}: ConfigIconProps) {
  const { type: configType } = config;

  const [primaryIcon, secondaryIcon] = useMemo(() => {
    if (configType?.split("::").length === 1) {
      return [configType, undefined];
    }
    const primaryIcon = configType?.split("::")[0];
    let secondaryIcon = configType;
    return [primaryIcon, secondaryIcon];
  }, [configType]);

  const value = useMemo(() => {
    if (configType?.split("::").length === 1) {
      return configType;
    }
    return configType
      ?.substring(configType.indexOf("::") + 2)
      .replaceAll("::", " ")
      .trim();
  }, [configType]);

  if (!configType) {
    return null;
  }

  return (
    <span className="flex flex-row items-center gap-1">
      <span className="flex flex-row items-center gap-1">
        {showPrimaryIcon && (
          <Icon
            name={primaryIcon}
            secondary={primaryIcon}
            className={className}
          />
        )}
        {showSecondaryIcon && primaryIcon !== secondaryIcon && (
          <Icon
            name={secondaryIcon}
            secondary={secondaryIcon}
            className={className}
            prefix={showPrimaryIcon ? <span className="1">/</span> : undefined}
          />
        )}
      </span>
      {showLabel && <span> {value}</span>}
      {children && <span>{children}</span>}
    </span>
  );
}
