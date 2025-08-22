import React, { useState } from "react";
import { GaugeConfig } from "../types";
import { generateGaugeData } from "./View/panels/utils";
import { formatBytes } from "../../../utils/common";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useHover,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal
} from "@floating-ui/react";

interface GaugeCellProps {
  value: number | { min: number; max: number; value: number };
  gauge?: GaugeConfig;
}

const GaugeCell: React.FC<GaugeCellProps> = ({ value, gauge }) => {
  const [isOpen, setIsOpen] = useState(false);

  const gaugeValue = typeof value === "number" ? value : value.value;
  const gaugeConfig =
    typeof value === "number"
      ? gauge
      : { ...gauge, min: value.min, max: value.max };

  const gaugeData = generateGaugeData({ value: gaugeValue }, gaugeConfig);
  const percentage = gaugeData.value;
  const color = gaugeData.color;

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(10), flip(), shift()],
    whileElementsMounted: autoUpdate
  });

  const hover = useHover(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    dismiss,
    role
  ]);

  // Format display value based on unit
  const formatDisplayValue = (value: number, unit?: string): string => {
    if (!unit) return value.toString();

    switch (unit) {
      case "bytes":
        return formatBytes(value);
      case "millicores":
      case "millicore":
        if (value === 0) return "";
        if (value > 0 && value < 1) return `1m`;
        return `${Math.round(value)}m`;
      default:
        return `${value} ${unit}`;
    }
  };

  const displayValue = formatDisplayValue(gaugeValue, gaugeConfig?.unit);
  const maxValue = gaugeConfig?.max;
  const maxDisplayValue = maxValue
    ? formatDisplayValue(maxValue, gaugeConfig?.unit)
    : undefined;

  return (
    <>
      <div
        className="flex w-full items-center gap-2"
        ref={refs.setReference}
        {...getReferenceProps()}
      >
        {/* Progress bar */}
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${percentage}%`,
              backgroundColor: color
            }}
          />
        </div>

        {/* Value text */}
        <span className="min-w-fit text-xs font-medium text-gray-700">
          {displayValue}
        </span>
      </div>

      {isOpen && maxDisplayValue && (
        <FloatingPortal>
          <div
            className="z-50 rounded bg-gray-900 px-2 py-1 text-xs font-medium text-white shadow-lg"
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
          >
            <p>Max: {maxDisplayValue}</p>
            <p>Percent: {percentage.toFixed(2)}%</p>
          </div>
        </FloatingPortal>
      )}
    </>
  );
};

export default GaugeCell;
