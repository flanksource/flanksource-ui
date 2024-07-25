import clsx from "clsx";
import { isEmpty } from "lodash";
import React, { useMemo, useState } from "react";
import { FiExternalLink } from "react-icons/fi";
import { Tooltip } from "react-tooltip";
import { Property } from "../../../../api/types/topology";
import ProgressBar from "../../../../ui/stats/ProgressBar";
import { formatBytes } from "../../../../utils/common";

type FormatPropertyProps = {
  property?: Property;
  short?: boolean;
  isSidebar?: boolean;
};

export function FormatPropertyURL({ property }: FormatPropertyProps) {
  if (property == null) {
    return null;
  }

  if (property.type !== "url") {
    return null;
  }

  return (
    <a
      href={property.text}
      target="_blank"
      rel="noreferrer"
      className="text-sm underline"
    >
      <span>{property.text?.replace("https://", "")}</span>
      <FiExternalLink className="ml-1 inline-block" />
    </a>
  );
}

export function FormatPropertyCurrency({ property }: FormatPropertyProps) {
  const amount = useMemo(() => {
    if (property == null) {
      return null;
    }
    if (property.type !== "currency") {
      return null;
    }
    const amount = parseFloat(property.value as string) || 0;
    if (amount > 1000) {
      return (amount / 1000).toFixed(1) + "k";
    } else if (amount > 100) {
      return amount.toFixed(0);
    } else if (amount > 10) {
      return amount.toFixed(1);
    } else if (amount > 0.01) {
      return amount.toFixed(2);
    } else if (amount > 0.001) {
      return amount.toFixed(3);
    }
    return amount;
  }, [property]);

  if (property == null) {
    return null;
  }

  if (property.type !== "currency") {
    return null;
  }

  return <span>{amount}</span>;
}

function convertUnitsToDisplayValue(value: number, unit?: string) {
  if (unit?.startsWith("milli")) {
    return `${(value / 1000).toFixed(2)}`;
  } else if (unit === "bytes") {
    return `${formatBytes(value, 1)}`;
  }
  return value;
}

export function FormatPropertyCPUMemory({
  property,
  isSidebar = false
}: FormatPropertyProps) {
  const derivedValue = useMemo(() => {
    if (property == null) {
      return undefined;
    }
    if (property.unit?.startsWith("milli")) {
      return (Number(property.value) / 1000).toFixed(2);
    }
    // 1e9 is 1GB, if the value is greater than 1GB, show 1 decimal place
    const decimalPlaces = Number(property.value) > 1e9 ? 1 : 0;
    return formatBytes(Number(property.value), decimalPlaces);
  }, [property]);

  if (
    !property ||
    !property.value ||
    (property?.name !== "cpu" && property?.name !== "memory")
  ) {
    return null;
  }

  const value = property.value;
  const max = property.max;

  const derivedMax = property.unit?.startsWith("milli")
    ? (Number(property.max) / 1000).toFixed(2)
    : formatBytes(Number(property.max), 1);

  if (max) {
    const percent = (Number(value) / Number(max)) * 100;
    return (
      <>
        <div
          data-tooltip-id="format-tooltip"
          data-tooltip-content={`${derivedValue} of ${derivedMax} (${percent.toFixed(
            0
          )}%)`}
          className="flex h-auto flex-col items-center gap-1"
        >
          <div
            className={clsx(
              `w-full text-ellipsis whitespace-nowrap text-xs`,
              isSidebar ? "text-left" : "text-center"
            )}
          >
            {derivedValue}
          </div>
          <div className="block w-12">
            <ProgressBar value={percent} />
          </div>
        </div>
        <Tooltip id="format-tooltip" />
      </>
    );
  }

  return (
    <>
      <span
        className="text-ellipsis whitespace-nowrap"
        data-tooltip-id="format-properties-tooltip"
        data-tooltip-content={derivedValue}
      >
        {derivedValue}
      </span>
      <Tooltip id="format-properties-tooltip" />
    </>
  );
}

export function FormatPropertyPercent({ property }: FormatPropertyProps) {
  if (!property || !property.value) {
    return null;
  }
  if (property.unit !== "percent") {
    return null;
  }
  const percentValue = parseFloat(property.value.toString()) * 100;
  return <span>{percentValue}%</span>;
}

export function FormatPropertyDefault({
  property,
  short
}: FormatPropertyProps) {
  const [tooltip, setTooltip] = useState<string>();

  const value = useMemo(() => {
    if (property == null) {
      return null;
    }
    let derivedValue: React.ReactNode =
      property.text || property.value?.toString();
    if (property.value != null) {
      if (property.max != null) {
        const percent = ((Number(property.value) / property.max) * 100).toFixed(
          0
        );
        derivedValue = `${percent}%`;
        if (parseFloat(percent) > 70) {
          derivedValue = (
            <span className="text-sm text-red-500">{derivedValue}</span>
          );
          setTooltip(
            `${convertUnitsToDisplayValue(
              Number(property.value),
              property.unit
            )}`
          );
        }
      } else if (property.unit && property.unit.startsWith("milli")) {
        derivedValue = (Number(property.value) / 1000).toFixed(2);
      } else if (property.unit === "bytes") {
        // questions here
        derivedValue = formatBytes(Number(property.value), 1);
      }
      let suffix = "";
      if (!short && property.max != null) {
        if (property.unit?.startsWith("milli")) {
          suffix = ` of ${(property.max / 1000).toFixed(2)}`;
        } else if (property.unit === "bytes") {
          suffix = ` of ${formatBytes(Number(property.max), 1)}`;
        }
      }
      if (suffix && derivedValue) {
        derivedValue =
          typeof derivedValue === "object" ? (
            <>
              {derivedValue} {suffix}
            </>
          ) : (
            derivedValue + suffix
          );
      }
    }
    if (derivedValue === property.text && !tooltip) {
      setTooltip(property.text);
    }
    return derivedValue;
  }, [property, short, tooltip]);

  if (property == null) {
    return null;
  }

  if (isEmpty(value)) {
    return null;
  }

  return (
    <p
      data-tooltip-html={tooltip}
      className={clsx("relative overflow-hidden text-ellipsis text-xs")}
    >
      {value}
    </p>
  );
}
