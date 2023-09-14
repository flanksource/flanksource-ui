import clsx from "clsx";
import EmptyState from "../EmptyState";
import TableSkeletonLoader from "../SkeletonLoader/TableSkeletonLoader";

type Column = {
  key: string;
  label: string;
};

type DetailsTableProps = {
  columns: Column[];
  data: Record<string, number | string | null | undefined | React.ReactNode>[];
  loading?: boolean;
  showHeader?: boolean;
};

export function DetailsTable({
  columns,
  data,
  loading,
  showHeader = true
}: DetailsTableProps) {
  if (loading) {
    return <TableSkeletonLoader />;
  }

  if (!data.length) {
    return (
      <div className="w-full">
        <EmptyState />
      </div>
    );
  }

  return (
    <table className="w-full text-sm text-left">
      {showHeader && (
        <thead className="text-sm uppercase text-gray-600">
          <tr>
            {columns.map((column) => {
              return (
                <th scope="col" className="p-2" key={column.label}>
                  {column.label}
                </th>
              );
            })}
          </tr>
        </thead>
      )}
      <tbody>
        {data.map((item, index) => (
          <tr
            className={clsx(
              index !== data.length - 1
                ? "border-b border-dashed border-gray-200"
                : ""
            )}
          >
            {columns.map((column, index) => {
              return (
                <td
                  className={clsx(
                    "p-2",
                    index === 0
                      ? "text-sm text-black whitespace-nowrap cursor-pointer"
                      : "py-1"
                  )}
                  key={index}
                >
                  {item[column.key]}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
