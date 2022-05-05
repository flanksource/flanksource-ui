import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { BsClock } from "react-icons/bs";
import { Dropdown } from ".";

export const refreshIntervalSelections = {
  1: {
    id: "1second",
    name: 1,
    icon: <BsClock />,
    description: "1 second",
    value: 1
  },
  5: {
    id: "5seconds",
    name: 5,
    icon: <BsClock />,
    description: "5 seconds",
    value: 5
  },
  10: {
    id: "10seconds",
    name: 10,
    icon: <BsClock />,
    description: "10 seconds",
    value: 10
  },
  30: {
    id: "30seconds",
    name: 30,
    icon: <BsClock />,
    description: "30 seconds",
    value: 30
  },
  60: {
    id: "1minute",
    name: 60,
    icon: <BsClock />,
    description: "1 minute",
    value: 60
  },
  300: {
    id: "5minutes",
    name: 300,
    icon: <BsClock />,
    description: "5 minutes",
    value: 300
  },
  600: {
    id: "10minutes",
    name: 600,
    icon: <BsClock />,
    description: "10 minutes",
    value: 600
  }
};

export function RefreshIntervalDropdown({
  defaultValue,
  onChange,
  className,
  defaultLabel = "Refresh Interval",
  ...rest
}) {
  const { control, watch } = useForm({
    defaultValues: { refreshInterval: defaultValue }
  });

  const watchRefreshInterval = watch("refreshInterval");

  useEffect(() => {
    if (watchRefreshInterval && onChange) {
      onChange(watchRefreshInterval);
    }
  }, [watchRefreshInterval, onChange]);

  return (
    <Dropdown
      name="refreshInterval"
      className={className}
      label={defaultLabel}
      items={refreshIntervalSelections}
      control={control}
      prefix={<div>lolol</div>}
      {...rest}
    />
  );
}
