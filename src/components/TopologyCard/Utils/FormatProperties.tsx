import { FiExternalLink } from "react-icons/fi";
import { TopologyProperty } from "../../../context/TopologyPageContext";
import React, { useMemo, useState } from "react";
import { formatBytes } from "../../../utils/common";
import { isEmpty } from "lodash";

type FormatPropertyProps = {
  property?: TopologyProperty;
  short?: boolean;
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
      className="underline text-sm"
    >
      <span>{property.text?.replace("https://", "")}</span>
      <FiExternalLink className="inline-block ml-1" />
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

export function FormatPropertyDefault({
  property,
  short
}: FormatPropertyProps) {
  const [tooltip, setTooltip] = useState<string>();

  const value = useMemo(() => {
    if (property == null) {
      return null;
    }
    let derivedValue: React.ReactNode = property.text;
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
    <span data-tip={tooltip} className="overflow-ellipsis text-sm">
      {value}
    </span>
  );
}
