import React, { memo } from "react";
import { Icon, IconProps } from ".";
import { ConfigItem } from "../../api/types/configs";

interface ConfigIconProps extends IconProps {
  config?: ConfigItem;
}

export const ConfigIcon: React.FC<ConfigIconProps> = memo(
  ({ className = "h-5 mr-1", config, ...props }) => {
    if (config == null) {
      return null;
    }
    return (
      <Icon
        name={config.type}
        secondary={config.config_class}
        className={className}
        {...props}
      />
    );
  }
);
