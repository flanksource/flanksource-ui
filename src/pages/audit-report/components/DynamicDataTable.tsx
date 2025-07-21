import React from "react";
import { ViewColumnDef } from "../types";
import { formatDate } from "../utils";
import DataTable from "./DataTable";
import { intervalToDuration } from "date-fns";
import HealthBadge, { HealthType } from "./HealthBadge";
import StatusBadge from "./StatusBadge";
import GaugeCell from "./GaugeCell";

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
  // Convert ViewColumnDef[] to DataTable Column format
  const adaptedColumns = columns
    .map((col, index) =>
      col.hidden
        ? null
        : {
            header: col.name,
            accessor: `col_${index}`,
            render: (value: any) => renderCellValue(value, col)
          }
    )
    .filter(Boolean) as {
    header: string;
    accessor: string;
    render: (value: any) => any;
  }[];

  // Convert rows array to object format expected by DataTable
  const adaptedData = rows.map((row) => {
    const rowObj: { [key: string]: any } = {};
    row.forEach((value, index) => {
      if (columns[index] && !columns[index].hidden) {
        rowObj[`col_${index}`] = value;
      }
    });
    return rowObj;
  });

  const renderCellValue = (value: any, column: ViewColumnDef) => {
    if (value == null) return "-";

    switch (column.type) {
      case "datetime":
        if (typeof value === "string" && /\d{4}-\d{2}-\d{2}/.test(value)) {
          return formatDate(value);
        }
        return String(value);

      case "boolean":
        return value ? "Yes" : "No";

      case "number":
        return typeof value === "number"
          ? value.toLocaleString()
          : String(value);

      case "duration":
        if (typeof value !== "number") {
          return String(value);
        }
        return formatDuration(value);

      case "health":
        return <HealthBadge health={value as HealthType} />;

      case "status":
        return <StatusBadge status={String(value)} />;

      case "gauge":
        if (!column.gauge) {
          return String(value);
        }
        return <GaugeCell value={value} gauge={column.gauge} />;

      default:
        return String(value);
    }
  };

  return (
    <DataTable columns={adaptedColumns} data={adaptedData} title={title} />
  );
};

export default DynamicDataTable;

const formatDuration = (nanoseconds: number): string => {
  const duration = intervalToDuration({
    start: 0,
    end: nanoseconds / 1_000_000
  });

  const parts = [];
  if (duration.years) parts.push(`${duration.years}y`);
  if (duration.months) parts.push(`${duration.months}mo`);
  if (duration.weeks) parts.push(`${duration.weeks}w`);
  if (duration.days) parts.push(`${duration.days}d`);
  if (duration.hours) parts.push(`${duration.hours}h`);
  if (duration.minutes) parts.push(`${duration.minutes}m`);
  if (duration.seconds) parts.push(`${duration.seconds}s`);

  // NOTE: just take the first 2 parts. The rest are insignificant.
  return parts.length > 0 ? parts.slice(0, 2).join(" ") : "0s";
};
