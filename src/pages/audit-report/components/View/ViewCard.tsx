import React from "react";
import { ViewColumnDef } from "../../types";
import GaugeCell from "../GaugeCell";
import { Link } from "react-router-dom";
import { formatBytes } from "../../../../utils/common";
import { formatDuration as formatDurationMs } from "../../../../utils/date";
import { Icon } from "../../../../ui/Icons/Icon";
import ConfigsTypeIcon from "../../../../components/Configs/ConfigsTypeIcon";
import { IconName } from "lucide-react/dynamic";
import { formatDate } from "../../utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "../../../../components/ui/card";
import { Badge } from "../../../../components/ui/badge";
import { Separator } from "../../../../components/ui/separator";
import { formatDisplayLabel } from "./panels/utils";
import clsx from "clsx";

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

interface ViewCardShadcnProps {
  columns: ViewColumnDef[];
  row: any[];
  rowData: Record<string, any>;
  card?: {
    columns: number;
    default?: boolean;
  };
}

const ViewCard: React.FC<ViewCardShadcnProps> = ({
  columns,
  row,
  rowData,
  card
}) => {
  // Get card-enabled columns only
  const cardColumns = columns.filter((col) => col.card != null);

  // Group columns by card.position
  const titleColumns = cardColumns.filter(
    (col) => col.card?.position === "title"
  );
  const subtitleColumns = cardColumns.filter(
    (col) => col.card?.position === "subtitle"
  );
  const deckColumns = cardColumns.filter(
    (col) => col.card?.position === "deck"
  );
  const bodyColumns = cardColumns.filter(
    (col) => col.card?.position === "body"
  );
  const footerColumns = cardColumns.filter(
    (col) => col.card?.position === "footer"
  );
  const headerRightColumns = cardColumns.filter(
    (col) => col.card?.position === "headerRight"
  );

  const rowAttributes = rowData.__rowAttributes as Record<
    string,
    RowAttributes
  >;

  // Get icon
  const firstTitleColumn = titleColumns[0];
  let icon: string | IconName | null = null;

  if (firstTitleColumn) {
    icon = rowAttributes?.[firstTitleColumn.name]?.icon || null;
    if (!icon && firstTitleColumn.type === "config_item") {
      const configData = rowAttributes?.[firstTitleColumn.name]?.config;
      if (configData?.type) {
        icon = null; // Will use ConfigsTypeIcon
      }
    }
    if (!icon && firstTitleColumn.icon) {
      icon = firstTitleColumn.icon;
    }
  }

  // Get accent color from the column marked with useForAccent
  const accentColumn = cardColumns.find((col) => col.card?.useForAccent);
  const accentColor = accentColumn
    ? getAccentColorFromValue(accentColumn.type, rowData[accentColumn.name])
    : undefined;

  return (
    <Card className="transition-shadow hover:shadow-lg">
      <CardHeader className="p-4 pb-3">
        {/* Card Title */}
        {titleColumns.map((col) => {
          const value = rowData[col.name];
          const cellContent = renderCellValue(
            value,
            col,
            rowData,
            rowAttributes,
            true
          );
          return (
            <CardTitle
              key={col.name}
              className="truncate font-normal leading-normal"
              title={String(value)}
            >
              {cellContent}
            </CardTitle>
          );
        })}

        {/* Card Description */}
        {subtitleColumns.map((col) => {
          const value = rowData[col.name];
          const cellContent = renderCellValue(
            value,
            col,
            rowData,
            rowAttributes
          );
          return (
            <CardDescription
              key={col.name}
              className="truncate"
              title={String(value)}
            >
              {cellContent}
            </CardDescription>
          );
        })}

        {/* Deck - inline items in header */}
        {deckColumns.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {deckColumns.map((col) => {
              const value = rowData[col.name];
              const cellContent = renderCellValue(
                value,
                col,
                rowData,
                rowAttributes
              );
              // Give gauges flex space for proper display
              const isGauge = col.type === "gauge";
              return (
                <div
                  key={col.name}
                  className={
                    isGauge
                      ? "flex min-w-0 flex-1 items-center gap-2"
                      : undefined
                  }
                >
                  {isGauge && (
                    <span className="whitespace-nowrap text-xs">
                      {formatDisplayLabel(col.name)}:
                    </span>
                  )}
                  {cellContent}
                </div>
              );
            })}
          </div>
        )}
      </CardHeader>

      {accentColor ? (
        <div className={clsx("h-0.5", accentColor)} />
      ) : (
        <Separator />
      )}

      <CardContent className="p-4 pt-3">
        {/* Body fields */}
        {bodyColumns.length > 0 && (
          <div
            className={clsx(
              "gap-x-2 gap-y-2 text-xs",
              card?.columns === 2
                ? "grid grid-cols-[auto_1fr_auto_1fr]"
                : "grid grid-cols-[auto_1fr]"
            )}
          >
            {bodyColumns.map((col) => {
              const value = rowData[col.name];
              const cellContent = renderCellValue(
                value,
                col,
                rowData,
                rowAttributes
              );
              return (
                <React.Fragment key={col.name}>
                  <span className="whitespace-nowrap font-semibold">
                    {formatDisplayLabel(col.name)}:
                  </span>
                  <span className="min-w-0 break-all">{cellContent}</span>
                </React.Fragment>
              );
            })}
          </div>
        )}
      </CardContent>

      {footerColumns.length > 0 && (
        <>
          <Separator />
          <CardFooter className="p-4 pt-3">
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              {footerColumns.map((col) => {
                const value = rowData[col.name];
                const cellContent = renderCellValue(
                  value,
                  col,
                  rowData,
                  rowAttributes
                );
                return (
                  <div key={col.name}>
                    <span className="font-semibold">
                      {formatDisplayLabel(col.name)}:{" "}
                    </span>
                    <span>{cellContent}</span>
                  </div>
                );
              })}
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  );
};

// Reuse cell rendering logic from DynamicDataTable
const renderCellValue = (
  value: any,
  column: ViewColumnDef,
  row: any,
  rowAttributes?: Record<string, RowAttributes>,
  skipAttributes?: boolean
) => {
  if (value == null) return "-";

  let cellContent: any;
  switch (column.type) {
    case "datetime":
      if (value instanceof Date) {
        cellContent = formatDate(value.toISOString());
      } else if (typeof value === "string" && /\d{4}-\d{2}-\d{2}/.test(value)) {
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
      const healthValue = String(value).toLowerCase();
      cellContent = (
        <Badge
          variant={
            healthValue === "healthy"
              ? "secondary"
              : healthValue === "warning"
                ? "default"
                : "destructive"
          }
          className={
            healthValue === "healthy"
              ? "bg-green-100 text-green-800 hover:bg-green-100/80"
              : healthValue === "warning"
                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80"
                : ""
          }
        ></Badge>
      );
      break;

    case "status":
      const statusValue = String(value);
      cellContent = (
        <Badge variant="outline" className="font-normal">
          {statusValue}
        </Badge>
      );
      break;

    case "gauge":
      if (!column.gauge) {
        cellContent = String(value);
      } else {
        const maxFromAttributes = rowAttributes?.[column.name]?.max;
        const gaugeConfig =
          maxFromAttributes !== undefined
            ? { ...column.gauge, max: Number(maxFromAttributes) }
            : column.gauge;

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
        <Link
          to={String(value)}
          className="text-primary underline hover:text-primary/80"
        >
          {String(value)}
        </Link>
      );
      break;

    case "badge":
      cellContent = <Badge variant="outline">{String(value)}</Badge>;
      break;

    case "config_item":
      const configData = rowAttributes?.[column.name]?.config;
      if (configData) {
        cellContent = (
          <Link
            to={`/catalog/${configData.id}`}
            className="flex flex-row items-center transition-colors hover:text-primary"
          >
            <ConfigsTypeIcon
              config={{ type: configData.type }}
              showPrimaryIcon={false}
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

  // Apply row attributes (icons, urls) - skip if this is for the title in header
  if (!skipAttributes) {
    const hasAttributes = rowAttributes && column.name in rowAttributes;
    if (hasAttributes) {
      const attribute = rowAttributes[column.name];

      // Handle icon attribute
      if (attribute.icon) {
        const iconStr = String(attribute.icon);
        const isBadge =
          React.isValidElement(cellContent) && cellContent.type === Badge;

        let iconElement: React.ReactNode;
        if (
          ["health", "healthy", "unhealthy", "warning", "unknown"].includes(
            iconStr
          )
        ) {
          const iconColor =
            iconStr === "healthy"
              ? "bg-green-500"
              : iconStr === "warning"
                ? "bg-yellow-500"
                : iconStr === "unhealthy"
                  ? "bg-red-500"
                  : "bg-gray-400";
          iconElement = (
            <span className={`h-2 w-2 rounded-full ${iconColor}`} />
          );
        } else {
          iconElement = (
            <Icon
              name={attribute.icon}
              className="h-4 w-4 text-muted-foreground"
            />
          );
        }

        if (isBadge) {
          // For badges, inject icon inside the badge
          cellContent = React.cloneElement(cellContent as React.ReactElement, {
            children: (
              <span className="inline-flex items-center gap-1.5">
                {iconElement}
                {(cellContent as React.ReactElement).props.children}
              </span>
            )
          });
        } else {
          // For non-badges, wrap with icon
          cellContent = (
            <span className="inline-flex items-center gap-1.5">
              {iconElement}
              {cellContent}
            </span>
          );
        }
      }

      // Handle URL attribute (applied after icon so link wraps the whole thing)
      if (attribute.url) {
        const url = attribute.url;
        cellContent = (
          <Link
            to={url}
            className="text-primary underline hover:text-primary/80"
          >
            {cellContent}
          </Link>
        );
      }
    }
  }

  return cellContent;
};

// Helper functions
const formatValueWithUnit = (value: any, unit?: string): any => {
  if (!unit || value == null) return value;

  switch (unit) {
    case "bytes":
      if (typeof value === "number") {
        return value;
      } else if (typeof value === "string") {
        const parsedBytes = parseMemoryUnit(value);
        return parsedBytes !== null ? parsedBytes : value;
      }
      return value;

    case "millicores":
    case "millicore":
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

const formatMillicore = (value: string | number): string => {
  let millicoreValue: number;

  if (typeof value === "string") {
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

  return `${Math.round(millicoreValue)}m`;
};

const parseMemoryUnit = (value: string): number | null => {
  const match = value.match(
    /^(\d+(?:\.\d+)?)(Ki|Mi|Gi|Ti|Pi|Ei|k|M|G|T|P|E)?$/
  );
  if (!match) return null;

  const [, numStr, unit] = match;
  const num = parseFloat(numStr);
  if (isNaN(num)) return null;

  const multipliers: { [key: string]: number } = {
    Ki: 1024,
    Mi: 1024 ** 2,
    Gi: 1024 ** 3,
    Ti: 1024 ** 4,
    Pi: 1024 ** 5,
    Ei: 1024 ** 6,
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

// Helper function to determine accent color from a column value based on type
const getAccentColorFromValue = (
  columnType: string,
  value: any
): string | undefined => {
  if (value == null) return undefined;

  const stringValue = String(value).toLowerCase();

  switch (columnType) {
    case "health":
      if (stringValue === "healthy") return "bg-green-200";
      if (stringValue === "warning") return "bg-yellow-200";
      return "bg-red-200";

    case "status":
      // Status can have various values - apply heuristics
      if (
        stringValue.includes("healthy") ||
        stringValue.includes("success") ||
        stringValue.includes("ok")
      ) {
        return "bg-green-200";
      }
      if (
        stringValue.includes("warning") ||
        stringValue.includes("pending") ||
        stringValue.includes("progress")
      ) {
        return "bg-yellow-200";
      }
      if (
        stringValue.includes("error") ||
        stringValue.includes("failed") ||
        stringValue.includes("unhealthy")
      ) {
        return "bg-red-200";
      }
      return undefined;

    default:
      return undefined;
  }
};

export default ViewCard;
