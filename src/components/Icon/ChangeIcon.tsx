import React, { memo } from "react";

import { Icon, IconProps } from ".";
import { ConfigChange } from "../../api/services/configs";

interface ChangeIconProps extends IconProps {
  change?: ConfigChange;
}

export const ChangeIcon: React.FC<ChangeIconProps> = memo(
  ({ className = "w-5 h-auto", name, change, ...props }) => {
    return (
      <Icon
        name={change?.change_type || name}
        className={`opacity-50 ${className}`}
        {...props}
      />
    );
  }
);
