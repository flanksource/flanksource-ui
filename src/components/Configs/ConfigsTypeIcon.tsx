import { useMemo } from "react";
import { ConfigItem } from "../../api/services/configs";
import { Icon } from "../Icon";

type ConfigIconProps = {
  config: Pick<ConfigItem, "type">;
  className?: string;
  showPrimaryIcon?: boolean;
  showSecondaryIcon?: boolean;
  showLabel?: boolean;
};

export default function ConfigsTypeIcon({
  config,
  className = "max-h-5 max-w-[1.25rem]",
  showPrimaryIcon = true,
  showSecondaryIcon = true,
  showLabel = false
}: ConfigIconProps) {
  const { type: configType } = config;

  const [primaryIcon, secondaryIcon] = useMemo(() => {
    if (configType?.split("::").length === 1) {
      return [configType, undefined];
    }
    const primaryIcon = configType?.split("::")[0];
    const secondaryIcon = configType?.substring(configType.indexOf("::") + 2);

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
    <span className="flex flex-nowrap gap-1 items-center">
      {showPrimaryIcon && (
        <Icon
          name={primaryIcon}
          secondary={primaryIcon}
          className={className}
        />
      )}
      {showSecondaryIcon && (
        <Icon
          name={secondaryIcon}
          secondary={secondaryIcon}
          className={className}
          prefix={showPrimaryIcon ? <span className="1">/</span> : undefined}
        />
      )}
      {showLabel && <span> {value}</span>}
    </span>
  );
}
