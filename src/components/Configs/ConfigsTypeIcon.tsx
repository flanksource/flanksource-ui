import { useMemo } from "react";
import { ConfigItem } from "../../api/types/configs";
import { Icon } from "../Icon";

export type ConfigIconProps = {
  config?: Pick<ConfigItem, "type">;
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
  const { type: configType } = config ? config : { type: null };

  const [primaryIcon, secondaryIcon] = useMemo(() => {
    if (configType?.split("::").length === 1) {
      return [configType, null];
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
    <div className="flex flex-row items-center gap-1 flex-1 overflow-hidden">
      <span className="flex flex-row items-center gap-1">
        {showPrimaryIcon && (
          <Icon
            name={primaryIcon}
            secondary={primaryIcon}
            className={className}
          />
        )}
        {showSecondaryIcon &&
          secondaryIcon &&
          primaryIcon !== secondaryIcon && (
            <Icon
              name={secondaryIcon}
              secondary={secondaryIcon}
              className={className}
              prefix={
                showPrimaryIcon ? <span className="1">/</span> : undefined
              }
            />
          )}
      </span>
      {showLabel && <span className="flex-1 overflow-hidden"> {value}</span>}
      {children && <span className="flex-1 overflow-hidden">{children}</span>}
    </div>
  );
}
