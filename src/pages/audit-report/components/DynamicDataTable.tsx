import React from "react";
import { ViewColumnDef } from "../types";
import { formatDate } from "../utils";

import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { MRT_ColumnDef } from "mantine-react-table";
import HealthBadge, { HealthType } from "./HealthBadge";
import StatusBadge from "./StatusBadge";
import GaugeCell from "./GaugeCell";
import BadgeCell from "./BadgeCell";
import { Link } from "react-router-dom";
import { formatBytes } from "../../../utils/common";
import { formatDuration as formatDurationMs } from "../../../utils/date";
import { Status } from "../../../components/Status";
import { Icon } from "../../../ui/Icons/Icon";
import { IconName } from "lucide-react/dynamic";

interface DynamicDataTableProps {
  columns: ViewColumnDef[];
  rows: any[][];
  title?: string;
  pageCount: number;
  totalRowCount?: number;
}

interface RowAttributes {
  icon?: IconName | "health" | "warning" | "unhealthy" | "unknown";
  url?: string;
  max?: number;
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
  pageCount,
  totalRowCount
}) => {
  const columnDef: MRT_ColumnDef<any>[] = columns
    .filter((col) => !col.hidden && col.type !== "row_attributes")
    .map((col) => {
      return {
        accessorKey: col.name,
        minSize: 15,
        maxSize: minWidthForColumnType(col.type),
        header: formatColumnHeader(col.name),
        Cell: ({ cell, row }: { cell: any; row: any }) =>
          renderCellValue(cell.getValue(), col, row.original)
      };
    });

  const adaptedData = rows.map((row) => {
    const rowObj: { [key: string]: any } = {};
    row.forEach((value, index) => {
      const column = columns[index];
      if (column && !column.hidden && column.type !== "row_attributes") {
        rowObj[column.name] = value;
      }
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

  return (
    <MRTDataTable
      enableColumnActions={false}
      columns={columnDef}
      data={adaptedData}
      enableServerSideSorting
      enableServerSidePagination
      manualPageCount={pageCount}
      totalRowCount={totalRowCount}
    />
  );
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
        const rowAttributes = row.__rowAttributes as Record<
          string,
          RowAttributes
        >;
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

    case "badge":
      cellContent = <BadgeCell value={String(value)} />;
      break;

    default:
      cellContent = String(value);
      break;
  }

  const rowAttributes = row.__rowAttributes as Record<string, RowAttributes>;
  const hasAttributes = rowAttributes && column.name in rowAttributes;
  if (hasAttributes) {
    const attribute = rowAttributes[column.name];
    if (attribute.url) {
      const url = attribute.url;
      cellContent = (
        <Link to={url} className="underline">
          {cellContent}
        </Link>
      );
    }

    if (attribute.icon) {
      // Handle icon rendering for health-related statuses
      if (
        ["health", "healthy", "unhealthy", "warning"].includes(attribute.icon)
      ) {
        return (
          <span className="inline-flex items-center gap-1">
            <Status status={attribute.icon} hideText={true} />
            {cellContent}
          </span>
        );
      }

      return (
        <span className="inline-flex items-center gap-1">
          <Icon name={attribute.icon} className="h-4 w-4" />
          {cellContent}
        </span>
      );
    }
  }

  return cellContent;
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

function minWidthForColumnType(type: ViewColumnDef["type"]): number {
  switch (type) {
    case "boolean":
      return 20;
    case "datetime":
      return 50;
    case "duration":
      return 40;
    case "health":
      return 30;
    case "status":
      return 50;
    case "gauge":
      return 40;
    case "bytes":
      return 40;
    case "decimal":
      return 40;
    case "millicore":
      return 40;
    case "badge":
      return 40;
    default:
      return 150;
  }
}

export default DynamicDataTable;
