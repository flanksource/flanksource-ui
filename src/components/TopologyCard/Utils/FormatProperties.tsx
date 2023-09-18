import { FiExternalLink } from "react-icons/fi";
import { TopologyProperty } from "../../../context/TopologyPageContext";
import React, { useMemo } from "react";
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

export function FormatPropertyDefault({
  property,
  short
}: FormatPropertyProps) {
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
        }
      } else if (property.unit && property.unit.startsWith("milli")) {
        derivedValue = (Number(property.value) / 1000).toFixed(2);
      } else if (property.unit === "bytes") {
        derivedValue = formatBytes(property.max!, 1);
      }
      let suffix = "";
      if (!short && property.max != null) {
        if (property.unit?.startsWith("milli")) {
          suffix = ` of ${(property.max / 1000).toFixed(2)}`;
        } else if (property.unit === "bytes") {
          suffix = ` of ${formatBytes(property.max, 1)}`;
        }
      }
      if (suffix && derivedValue) {
        derivedValue =
          typeof derivedValue === "object" ? (
            <>
              {derivedValue}
              {suffix}
            </>
          ) : (
            derivedValue + suffix
          );
      }
    }
    return derivedValue;
  }, [property, short]);

  if (property == null) {
    return null;
  }

  if (isEmpty(value)) {
    return null;
  }

  return (
    <span data-tip={value} className="overflow-ellipsis text-sm">
      {value}
    </span>
  );
}
