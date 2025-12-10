import React from "react";
import { MRT_ColumnDef } from "mantine-react-table";
import { SortingState } from "@tanstack/react-table";
import { Link, useSearchParams } from "react-router-dom";
import { IconName } from "lucide-react/dynamic";

import { Tag } from "@flanksource-ui/ui/Tags/Tag";
import { Age } from "@flanksource-ui/ui/Age";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { FilterByCellValue } from "@flanksource-ui/ui/DataTable/FilterByCellValue";

import { ViewColumnDef } from "../types";
import HealthBadge, { HealthType } from "./HealthBadge";
import GaugeCell from "./GaugeCell";
import { formatBytes } from "../../../utils/common";
import { formatDuration as formatDurationMs } from "../../../utils/date";
import { Status } from "../../../components/Status";
import { Icon } from "../../../ui/Icons/Icon";
import ConfigsTypeIcon from "../../../components/Configs/ConfigsTypeIcon";
import {
  formatDisplayLabel,
  getSeverityOfText,
  severityToHex
} from "./View/panels/utils";

interface DynamicDataTableProps {
  columns: ViewColumnDef[];
  rows: any[][];
  title?: string;
  pageCount: number;
  totalRowCount?: number;
  isLoading?: boolean;
  tablePrefix?: string;
  defaultPageSize?: number;
  defaultSorting?: SortingState;
}

interface RowAttributes {
  icon?: IconName | "health" | "warning" | "unhealthy" | "unknown";
  url?: string;
  max?: number;
  config?: {
    id: string;
    type: string;
    class: string;
  };
}

export const hiddenColumnTypes = ["row_attributes", "grants"];

const DynamicDataTable: React.FC<DynamicDataTableProps> = ({
  columns,
  rows,
  pageCount,
  totalRowCount,
  isLoading,
  tablePrefix,
  defaultPageSize,
  defaultSorting
}) => {
  const visibleColumnsWithRatio = React.useMemo(() => {
    return columns.reduce<
      {
        column: ViewColumnDef;
        width?: string;
      }[]
    >((acc, col) => {
      if (col.hidden || hiddenColumnTypes.includes(col.type)) {
        return acc;
      }
      const width = col.width;
      acc.push({ column: col, width });
      return acc;
    }, []);
  }, [columns]);

  const baseWidth = React.useMemo(
    () => Math.max(visibleColumnsWithRatio.length * 120, 120),
    [visibleColumnsWithRatio.length]
  );

  const { customWidths, widthError } = React.useMemo(() => {
    const widths: Record<string, number> = {};
    let totalWeight = 0;
    const weightColumns: { name: string; weight: number }[] = [];

    for (const { column: col, width } of visibleColumnsWithRatio) {
      if (!width) {
        continue;
      }
      const widthStr = String(width).trim();
      const match = widthStr.match(/^([0-9]+(?:\.[0-9]+)?)(px)?$/);
      if (!match) {
        return {
          customWidths: {},
          widthError: `Invalid column width "${widthStr}" for column "${col.name}". Use weight (e.g. "2") or px (e.g. "150px").`
        };
      }
      const value = parseFloat(match[1]);
      const unit = match[2];
      if (Number.isNaN(value) || value <= 0) {
        return {
          customWidths: {},
          widthError: `Invalid column width "${widthStr}" for column "${col.name}". Use positive values like "2" or "150px".`
        };
      }

      if (unit === "px") {
        widths[col.name] = Math.max(20, Math.round(value));
      } else {
        weightColumns.push({ name: col.name, weight: value });
        totalWeight += value;
      }
    }

    if (weightColumns.length > 0 && totalWeight > 0) {
      weightColumns.forEach(({ name, weight }) => {
        widths[name] = Math.max(
          20,
          Math.round((weight / totalWeight) * baseWidth)
        );
      });
    }
    return {
      customWidths: widths,
      widthError: undefined as string | undefined
    };
  }, [baseWidth, visibleColumnsWithRatio]);

  const columnDef: MRT_ColumnDef<any>[] = visibleColumnsWithRatio.map(
    ({ column: col }) => {
      const calculatedSize = widthError ? undefined : customWidths[col.name];

      return {
        accessorKey: col.name,
        ...(calculatedSize === undefined
          ? {
              minSize: 15,
              maxSize: minWidthForColumnType(col.type)
            }
          : {}),
        size: calculatedSize,
        header: formatDisplayLabel(col.name),
        enableSorting: col.type !== "labels",
        Cell: ({ cell, row }: { cell: any; row: any }) =>
          renderCellValue(cell.getValue(), col, row.original, tablePrefix)
      };
    }
  );

  const adaptedData = rows.map((row) => {
    const rowObj: { [key: string]: any } = {};
    row.forEach((value, index) => {
      const column = columns[index];
      if (!column) {
        return;
      }

      if (column.hidden || hiddenColumnTypes.includes(column.type)) {
        // These columns are not displayed in the table
        return;
      }

      const convertedValue = convertViewCellToNativeType(value, column);
      rowObj[column.name] = convertedValue;
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
    <>
      {widthError && (
        <div className="mb-2 text-sm text-red-600">
          {widthError} Falling back to default column widths.
        </div>
      )}
      <MRTDataTable
        enableColumnActions={false}
        columns={columnDef}
        isLoading={isLoading}
        data={adaptedData}
        enableServerSideSorting
        enableServerSidePagination
        manualPageCount={pageCount}
        totalRowCount={totalRowCount}
        urlParamPrefix={tablePrefix}
        defaultPageSize={defaultPageSize}
        defaultSorting={defaultSorting}
      />
    </>
  );
};

type LabelsCellProps = {
  entries: [string, any][];
  hasFilter: boolean;
  paramKey: string;
};

const LabelsCell: React.FC<LabelsCellProps> = ({
  entries,
  hasFilter,
  paramKey
}) => {
  const [params, setParams] = useSearchParams();

  const onFilterByTag = React.useCallback(
    (
      e: React.MouseEvent<HTMLButtonElement>,
      tag: { key: string; value: string },
      action: "include" | "exclude"
    ) => {
      e.preventDefault();
      e.stopPropagation();

      const currentValue = params.get(paramKey);
      const currentValues = currentValue ? currentValue.split(",") : [];

      // Filter out conflicting values for the same tag
      const filteredValues = currentValues.filter((val) => {
        const tagKey = val.split("____")[0];
        const tagAction = val.split(":")[1] === "1" ? "include" : "exclude";
        return !(tagKey === tag.key && tagAction !== action);
      });

      // Add new filter value
      const newFilterValue = `${tag.key}____${tag.value}:${action === "include" ? 1 : -1}`;
      const updatedValues = filteredValues
        .concat(newFilterValue)
        .filter((val, idx, self) => self.indexOf(val) === idx)
        .join(",");

      params.set(paramKey, updatedValues);
      params.delete("pageIndex");
      setParams(params);
    },
    [params, paramKey, setParams]
  );

  return (
    <div className="flex flex-wrap gap-1">
      {entries.map(([key, val]) => (
        <Tag
          key={key}
          tag={{ key, value: String(val) }}
          variant="gray"
          onFilterByTag={hasFilter ? onFilterByTag : undefined}
        >
          {key}: {String(val)}
        </Tag>
      ))}
    </div>
  );
};

const renderCellValue = (
  value: any,
  column: ViewColumnDef,
  row: any,
  tablePrefix?: string
) => {
  if (value == null) return "-";

  let cellContent: any;
  switch (column.type) {
    case "datetime":
      cellContent = <Age from={value} />;
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
      if (!column.icon) {
        // If the column doesn't have an icon defined, we use the Status component
        // that uses heuristic coloring based on the status string.
        cellContent = <Status status={String(value)} />;
      } else {
        cellContent = String(value);
      }

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

    case "labels":
      if (value && typeof value === "object" && !Array.isArray(value)) {
        const entries = Object.entries(value).filter(
          ([key]) => key !== "toString"
        );
        const hasFilter = column.filter?.type === "multiselect";
        const paramKey = tablePrefix
          ? `${tablePrefix}__${column.name}`
          : column.name;

        cellContent =
          entries.length > 0 ? (
            <LabelsCell
              entries={entries}
              hasFilter={hasFilter}
              paramKey={paramKey}
            />
          ) : (
            "-"
          );
      } else {
        cellContent = "-";
      }
      break;

    case "config_item":
      const rowAttributes = row.__rowAttributes as Record<
        string,
        RowAttributes
      >;
      const configData = rowAttributes?.[column.name]?.config;
      if (configData) {
        cellContent = (
          <Link
            to={`/catalog/${configData.id}`}
            className="flex flex-row items-center"
          >
            <ConfigsTypeIcon
              config={{ type: configData.type }}
              showPrimaryIcon={true}
            >
              <span>{value}</span>
            </ConfigsTypeIcon>
          </Link>
        );
      } else {
        cellContent = String(value);
      }
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
        ["healthy", "unknown", "unhealthy", "warning"].includes(attribute.icon)
      ) {
        cellContent = (
          <span className="inline-flex items-center gap-1">
            <Status status={attribute.icon} hideText={true} />
            {cellContent}
          </span>
        );
      } else {
        cellContent = (
          <span className="inline-flex items-center gap-1">
            <Icon name={attribute.icon} className="h-4 w-4" />
            {cellContent}
          </span>
        );
      }
    }
  }

  // Apply badge styling if badge property is configured
  if (column.badge) {
    let backgroundColor = "#E5E7EB";

    if (column.badge.color?.auto) {
      // Use severity-based coloring
      const severity = getSeverityOfText(String(value));
      const colors = severityToHex[severity];
      backgroundColor = colors?.[0] || backgroundColor;
    } else if (column.badge.color?.map) {
      // Use explicit color mapping
      backgroundColor =
        column.badge.color.map[String(value)] || backgroundColor;
    }

    cellContent = (
      <span
        className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-gray-800"
        style={{ backgroundColor }}
      >
        {value}
      </span>
    );
  }

  // Wrap with FilterByCellValue if column has multiselect filter
  // Skip labels columns since they handle filtering individually per tag
  if (column.filter?.type === "multiselect" && column.type !== "labels") {
    // Use prefixed parameter key if tablePrefix is provided
    const paramKey = tablePrefix
      ? `${tablePrefix}__${column.name}`
      : column.name;

    return (
      <FilterByCellValue
        paramKey={paramKey}
        filterValue={value}
        paramsToReset={["pageIndex"]}
      >
        {cellContent}
      </FilterByCellValue>
    );
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

  if (millicoreValue >= 1000) {
    return `${(millicoreValue / 1000).toFixed(2)} cores`;
  }

  // values < 1000 means it's a millicore.
  // No need to display decimal values for a millicore.
  return `${Math.round(millicoreValue)}m`;
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
      return 50;
    case "status":
      return 70;
    case "gauge":
      return 40;
    case "bytes":
      return 40;
    case "decimal":
      return 40;
    case "millicore":
      return 40;
    case "config_item":
      return 150;
    default:
      return 150;
  }
}

// Convert view cell to native types, mimicking backend conversion logic
const convertViewCellToNativeType = (
  value: any,
  column: ViewColumnDef
): any => {
  if (value == null) {
    return value;
  }

  switch (column.type) {
    case "gauge":
      if (value instanceof Uint8Array || Array.isArray(value)) {
        try {
          const jsonString = new TextDecoder().decode(new Uint8Array(value));
          return JSON.parse(jsonString);
        } catch (e) {
          console.warn(
            "convertViewCellToNativeType: failed to parse gauge JSON:",
            e
          );
          return value;
        }
      }
      return value;

    case "row_attributes":
      if (value instanceof Uint8Array || Array.isArray(value)) {
        try {
          const jsonString = new TextDecoder().decode(new Uint8Array(value));
          return JSON.parse(jsonString);
        } catch (e) {
          console.warn(
            "convertViewCellToNativeType: failed to parse attributes JSON:",
            e
          );
          return value;
        }
      }
      return value;

    case "duration":
      if (typeof value === "number") {
        return value; // Already a number, assume it's in nanoseconds
      }

      if (typeof value === "string") {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          return numValue;
        }
      }
      console.warn(
        "convertViewCellToNativeType: unknown duration type:",
        typeof value
      );
      return value;

    case "datetime":
      if (value instanceof Date) {
        return value;
      }
      if (typeof value === "string") {
        try {
          const parsed = new Date(value);
          if (!isNaN(parsed.getTime())) {
            return parsed;
          }
        } catch (e) {
          console.warn(
            "convertViewCellToNativeType: failed to parse datetime:",
            e
          );
        }
      }
      console.warn(
        "convertViewCellToNativeType: unknown datetime type:",
        typeof value
      );
      return value;

    default:
      return value;
  }
};

export default DynamicDataTable;
