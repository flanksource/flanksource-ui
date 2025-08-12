import React from "react";
import { ViewColumnDef } from "../types";
import { formatDate } from "../utils";
import DataTable from "./DataTable";
import HealthBadge, { HealthType } from "./HealthBadge";
import StatusBadge from "./StatusBadge";
import GaugeCell from "./GaugeCell";
import { Link } from "react-router-dom";
import { formatBytes } from "../../../utils/common";
import { formatDuration as formatDurationMs } from "../../../utils/date";

interface DynamicDataTableProps {
  columns: ViewColumnDef[];
  rows: any[][];
  title?: string;
}

// Convert column names to display-friendly headers
// Examples: "memory_limit" -> "Memory Limit", "lastUpdated" -> "Last Updated"
const formatColumnHeader = (name: string): string => {
  return name
    .replace(/_/g, " ") // Convert underscores to spaces
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Add spaces before capital letters in camelCase
    .replace(/\b\w/g, (l) => l.toUpperCase()); // Capitalize first letter of each word
};

const DynamicDataTable: React.FC<DynamicDataTableProps> = ({
  columns,
  rows,
  title
}) => {
  const adaptedColumns = columns
    .map((col, index) =>
      col.hidden || col.type === "row_attributes"
        ? null
        : {
            header: formatColumnHeader(col.name),
            accessor: `col_${index}`,
            render: (value: any, row: any) => renderCellValue(value, col, row)
          }
    )
    .filter(Boolean) as {
    header: string;
    accessor: string;
    render: (value: any, row: any) => any;
  }[];

  const adaptedData = rows.map((row) => {
    const rowObj: { [key: string]: any } = {};
    row.forEach((value, index) => {
      rowObj[`col_${index}`] = value;
    });

    const attributesColumn = columns.find(
      (col) => col.type === "row_attributes"
    );
    if (attributesColumn) {
      const attributesIndex = columns.indexOf(attributesColumn);
      if (attributesIndex !== -1 && row[attributesIndex]) {
        rowObj.__rowAttributes = row[attributesIndex];
      }
    }

    return rowObj;
  });

  // Format millicore values following the existing pattern from topology formatting
  const formatMillicore = (value: string | number): string => {
    let millicoreValue: number;

    if (typeof value === "string") {
      // Handle string format like "100m" or "1500m"
      const numericValue = value.replace(/m$/, "");
      millicoreValue = parseInt(numericValue, 10);
      if (isNaN(millicoreValue)) {
        return String(value);
      }
    } else if (typeof value === "number") {
      millicoreValue = value;
    } else {
      return String(value);
    }

    // Follow the same pattern as topology formatting: convert to cores if >= 1000m
    if (millicoreValue >= 1000) {
      return `${(millicoreValue / 1000).toFixed(2)} cores`;
    }
    return `${millicoreValue}m`;
  };

  // Parse Kubernetes memory units (e.g., "192Mi", "1Gi", "512Ki") to bytes
  const parseMemoryUnit = (value: string): number | null => {
    const match = value.match(
      /^(\d+(?:\.\d+)?)(Ki|Mi|Gi|Ti|Pi|Ei|k|M|G|T|P|E)?$/
    );
    if (!match) return null;

    const [, numStr, unit] = match;
    const num = parseFloat(numStr);
    if (isNaN(num)) return null;

    const multipliers: { [key: string]: number } = {
      // Binary units (1024-based)
      Ki: 1024,
      Mi: 1024 ** 2,
      Gi: 1024 ** 3,
      Ti: 1024 ** 4,
      Pi: 1024 ** 5,
      Ei: 1024 ** 6,
      // Decimal units (1000-based)
      k: 1000,
      M: 1000 ** 2,
      G: 1000 ** 3,
      T: 1000 ** 4,
      P: 1000 ** 5,
      E: 1000 ** 6
    };

    const multiplier = unit ? multipliers[unit] : 1;
    return multiplier ? num * multiplier : null;
  };

  // Format values based on unit type for gauge display
  const formatValueWithUnit = (value: any, unit?: string): any => {
    if (!unit || value == null) return value;

    switch (unit) {
      case "bytes":
        if (typeof value === "number") {
          return value; // Keep numeric value for gauge calculation, unit display handled by GaugeCell
        } else if (typeof value === "string") {
          const parsedBytes = parseMemoryUnit(value);
          return parsedBytes !== null ? parsedBytes : value;
        }
        return value;

      case "millicores":
      case "millicore":
        // Use existing formatMillicore function logic but return numeric value for gauge
        if (typeof value === "string") {
          const numericValue = value.replace(/m$/, "");
          const millicoreValue = parseInt(numericValue, 10);
          return !isNaN(millicoreValue) ? millicoreValue : value;
        } else if (typeof value === "number") {
          return value;
        }
        return value;

      default:
        return value;
    }
  };

  const renderCellValue = (value: any, column: ViewColumnDef, row: any) => {
    if (value == null) return "-";

    let cellContent: any;
    switch (column.type) {
      case "datetime":
        if (typeof value === "string" && /\d{4}-\d{2}-\d{2}/.test(value)) {
          cellContent = formatDate(value);
        } else {
          cellContent = String(value);
        }
        break;

      case "boolean":
        cellContent = value ? "Yes" : "No";
        break;

      case "number":
        cellContent =
          typeof value === "number" ? value.toLocaleString() : String(value);
        break;

      case "duration":
        if (typeof value !== "number") {
          cellContent = String(value);
        } else {
          // Convert nanoseconds to milliseconds for the existing formatDuration function
          cellContent = formatDurationMs(value / 1_000_000);
        }
        break;

      case "bytes":
        if (typeof value === "number") {
          cellContent = formatBytes(value);
        } else if (typeof value === "string") {
          const parsedBytes = parseMemoryUnit(value);
          if (parsedBytes !== null) {
            cellContent = formatBytes(parsedBytes);
          } else {
            cellContent = String(value);
          }
        } else {
          cellContent = String(value);
        }
        break;

      case "decimal":
        if (typeof value === "number") {
          cellContent = value.toFixed(2);
        } else {
          cellContent = String(value);
        }
        break;

      case "millicore":
        cellContent = formatMillicore(value);
        break;

      case "health":
        cellContent = <HealthBadge health={value as HealthType} />;
        break;

      case "status":
        cellContent = <StatusBadge status={String(value)} />;
        break;

      case "gauge":
        if (!column.gauge) {
          cellContent = String(value);
        } else {
          // Check if row attributes contain a max value for this column
          const rowAttributes = row.__rowAttributes as Record<string, any>;
          const maxFromAttributes = rowAttributes?.[column.name]?.max;

          const gaugeConfig =
            maxFromAttributes !== undefined
              ? { ...column.gauge, max: Number(maxFromAttributes) }
              : column.gauge;

          // Apply unit formatting based on column.unit
          const formattedValue = formatValueWithUnit(value, column.unit);
          const finalGaugeConfig = {
            ...gaugeConfig,
            unit: column.unit || gaugeConfig.unit
          };

          cellContent = (
            <GaugeCell value={formattedValue} gauge={finalGaugeConfig} />
          );
        }
        break;

      case "url":
        cellContent = (
          <Link to={String(value)} className="underline">
            {String(value)}
          </Link>
        );
        break;

      default:
        cellContent = String(value);
        break;
    }

    const rowAttributes = row.__rowAttributes as Record<string, any>;
    if (
      rowAttributes &&
      column.name in rowAttributes &&
      rowAttributes[column.name].url
    ) {
      const url = rowAttributes[column.name].url;
      cellContent = (
        <Link to={url} className="underline">
          {cellContent}
        </Link>
      );
    }

    return cellContent;
  };

  return (
    <DataTable columns={adaptedColumns} data={adaptedData} title={title} />
  );
};

export default DynamicDataTable;
