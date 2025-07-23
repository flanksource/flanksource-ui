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

const DynamicDataTable: React.FC<DynamicDataTableProps> = ({
  columns,
  rows,
  title
}) => {
  const adaptedColumns = columns
    .map((col, index) =>
      col.hidden || col.for
        ? null
        : {
            header: col.name,
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
    return rowObj;
  });

  const columnIndexMap = React.useMemo(() => {
    const map = new Map<ViewColumnDef, number>();
    columns.forEach((col, index) => {
      map.set(col, index);
    });
    return map;
  }, [columns]);

  const forColumnsMap = React.useMemo(() => {
    const map = new Map<string, ViewColumnDef[]>();
    columns.forEach((col) => {
      if (col.for) {
        if (!map.has(col.for)) {
          map.set(col.for, []);
        }
        map.get(col.for)!.push(col);
      }
    });
    return map;
  }, [columns]);

  const applyHelperColumns = (
    cellContent: any,
    column: ViewColumnDef,
    row: any
  ) => {
    const forColumns = forColumnsMap.get(column.name) || [];
    let enhancedContent = cellContent;

    for (const forCol of forColumns) {
      const forColIndex = columnIndexMap.get(forCol);
      if (forColIndex !== undefined) {
        const forValue = row[`col_${forColIndex}`];

        if (forCol.type === "url" && forValue) {
          enhancedContent = (
            <Link to={forValue} className="underline">
              {enhancedContent}
            </Link>
          );
        }
      }
    }

    return enhancedContent;
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
          cellContent = <GaugeCell value={value} gauge={column.gauge} />;
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

    return applyHelperColumns(cellContent, column, row);
  };

  return (
    <DataTable columns={adaptedColumns} data={adaptedData} title={title} />
  );
};

export default DynamicDataTable;
