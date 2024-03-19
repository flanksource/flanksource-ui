import React, { memo } from "react";
import { Icon } from ".";
import { ConfigChange } from "../../api/types/configs";

interface ChangeIconProps {
  change?: Pick<ConfigChange, "change_type">;
  className?: string;
  name?: string;
}

export const ChangeIcon: React.FC<ChangeIconProps> = memo(
  ({ className = "w-5 h-auto", name, change }) => {
    return (
      <Icon
        name={change?.change_type || name}
        className={`opacity-50 ${className}`}
      />
    );
  }
);
