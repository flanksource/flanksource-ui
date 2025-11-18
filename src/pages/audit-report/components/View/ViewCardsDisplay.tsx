import React from "react";
import { ViewColumnDef } from "../../types";
import ViewCard from "./ViewCard";

interface ViewCardsDisplayProps {
  columns: ViewColumnDef[];
  rows: any[][];
  columnsCount?: number;
  isLoading?: boolean;
  pageCount?: number;
  totalRowCount?: number;
}

const ViewCardsDisplay: React.FC<ViewCardsDisplayProps> = ({
  columns,
  rows,
  columnsCount,
  isLoading
}) => {
  // Convert rows to objects (same logic as DynamicDataTable)
  const adaptedData = rows.map((row) => {
    const rowObj: { [key: string]: any } = {};
    row.forEach((value, index) => {
      const column = columns[index];
      if (!column) {
        throw new Error(`Column definition not found for index ${index}`);
      }

      if (column.type === "row_attributes") {
        // Row attributes are handled separately
        return;
      }

      const convertedValue = convertViewCellToNativeType(value, column);
      rowObj[column.name] = convertedValue;
    });

    // Store row attributes separately
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!rows || rows.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center text-gray-500">
          <p className="text-lg font-medium">No data available</p>
          <p className="text-sm">Try adjusting your filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 lg:grid-cols-3">
      {adaptedData.map((row, index) => (
        <ViewCard
          key={index}
          columns={columns}
          row={row}
          columnsCount={columnsCount}
        />
      ))}
    </div>
  );
};

// Convert view cell to native types (same as DynamicDataTable)
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
        return value;
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

export default ViewCardsDisplay;
