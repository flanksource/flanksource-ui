import React, { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

interface Column {
  header: string;
  accessor: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  title?: string;
}

const DataTable: React.FC<DataTableProps> = ({ columns, data, title }) => {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending";
  } | null>(null);

  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending";

    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }

    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  const renderSortIndicator = (column: string) => {
    if (sortConfig && sortConfig.key === column) {
      return sortConfig.direction === "ascending" ? (
        <ChevronUp className="ml-1 inline-block h-3 w-3" />
      ) : (
        <ChevronDown className="ml-1 inline-block h-3 w-3" />
      );
    }
    return null;
  };

  const getColumnWidth = (accessor: string) => {
    if (accessor === "description") {
      return "w-full min-w-[200px]";
    }

    switch (accessor) {
      case "date":
      case "created":
      case "lastLogin":
      case "lastAccessReview":
      case "completedDate":
      case "resolvedDate":
        return "w-32 min-w-[128px]";
      case "email":
        return "w-48 min-w-[192px]";
      case "name":
      case "user":
      case "database":
      case "source":
        return "w-40 min-w-[160px]";
      case "role":
      case "status":
      case "severity":
      case "size":
        return "w-28 min-w-[112px]";
      default:
        return "w-36 min-w-[144px]";
    }
  };

  return (
    <div className="mb-4">
      {title && <h3 className="mb-2 text-lg font-medium">{title}</h3>}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.accessor}
                  onClick={() => requestSort(column.accessor)}
                  className={`cursor-pointer whitespace-nowrap ${getColumnWidth(column.accessor)}`}
                >
                  <div className="flex items-center">
                    {column.header}
                    {renderSortIndicator(column.accessor)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.length > 0 ? (
              sortedData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((column) => (
                    <td
                      key={`${rowIndex}-${column.accessor}`}
                      className={`truncate ${getColumnWidth(column.accessor)}`}
                    >
                      {column.render
                        ? column.render(row[column.accessor], row)
                        : row[column.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="py-4 text-center">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
