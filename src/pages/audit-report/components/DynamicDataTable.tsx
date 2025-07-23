import React from "react";
import { ViewColumnDef } from "../types";
import { formatDate } from "../utils";
import DataTable from "./DataTable";
import { intervalToDuration } from "date-fns";
import HealthBadge, { HealthType } from "./HealthBadge";
import StatusBadge from "./StatusBadge";
import GaugeCell from "./GaugeCell";
import { Link } from "react-router-dom";

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

  const renderCellValue = (value: any, column: ViewColumnDef, row: any) => {
    if (value == null) return "-";

    const forColumns = forColumnsMap.get(column.name) || [];

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
          cellContent = formatDuration(value);
        }
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

      default:
        cellContent = String(value);
        break;
    }

    for (const forCol of forColumns) {
      const forColIndex = columnIndexMap.get(forCol);
      if (forColIndex !== undefined) {
        const forValue = row[`col_${forColIndex}`];

        if (forCol.type === "url" && forValue) {
          cellContent = (
            <Link to={forValue} className="underline">
              {cellContent}
            </Link>
          );
        }
      }
    }

    return cellContent;
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
