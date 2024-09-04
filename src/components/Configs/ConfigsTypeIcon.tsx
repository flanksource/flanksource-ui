import { ConfigItem } from "@flanksource-ui/api/types/configs";
import { areTwoIconNamesEqual, Icon } from "@flanksource-ui/ui/Icons/Icon";
import { useMemo } from "react";

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
      return [configType, undefined];
    }
    const primaryIcon = configType?.split("::")[0];
    let secondaryIcon = configType ?? undefined;
    return [primaryIcon, secondaryIcon];
  }, [configType]);

  const isPrimaryIconSameAsSecondaryIcon = useMemo(() => {
    return areTwoIconNamesEqual(primaryIcon, secondaryIcon);
  }, [primaryIcon, secondaryIcon]);

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
    <div className="flex flex-1 flex-row items-center gap-1 overflow-hidden">
      <span className="flex flex-row items-center gap-1">
        {showPrimaryIcon && (
          <Icon
            name={primaryIcon}
            secondary={primaryIcon}
            className={className}
          />
        )}
        {showSecondaryIcon &&
          !isPrimaryIconSameAsSecondaryIcon &&
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
      {showLabel && <span> {value}</span>}
      {/*  eslint-disable-next-line react/jsx-no-useless-fragment */}
      {children && <>{children}</>}
    </div>
  );
}
