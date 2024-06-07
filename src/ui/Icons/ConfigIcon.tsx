import React, { memo } from "react";
import { ConfigItem } from "../../api/types/configs";
import { Icon } from "./Icon";

interface ConfigIconProps {
  config?: Pick<ConfigItem, "type" | "config_class">;
  children?: React.ReactNode;
  className?: string;
}

export const ConfigIcon: React.FC<ConfigIconProps> = memo(
  ({ className = "h-5 w-auto mr-1", config, ...props }) => {
    if (config == null) {
      return null;
    }
    return (
      <Icon
        name={config.type}
        secondary={config.config_class}
        className={className}
      />
    );
  }
);
