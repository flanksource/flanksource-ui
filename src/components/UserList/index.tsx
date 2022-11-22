import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { formatLongDate } from "../../utils/date";
import { DataTable } from "../DataTable";

type UserListProps = {
  data: any[];
  isLoading?: boolean;
};

const DateCell = ({ cell: { value } }: { cell: { value: Date } }) =>
  formatLongDate(value);

const columns = [
  {
    Header: "Name",
    accessor: "name"
  },
  {
    Header: "Email",
    accessor: "email",
    Aggregated: ""
  },
  {
    Header: "Created At",
    accessor: "created_at",
    Cell: DateCell,
    sortType: "datetime",
    Aggregated: ""
  },
  {
    Header: "State",
    accessor: "state",
    Aggregated: ""
  }
];

export function UserList({ data, isLoading }: UserListProps) {
  const [queryParams, setQueryParams] = useSearchParams({
    sortBy: "",
    sortOrder: ""
  });

  const sortField = queryParams.get("sortBy");
  const isSortOrderDesc =
    queryParams.get("sortOrder") === "desc" ? true : false;

  const setSortBy = (field: string, order: "asc" | "desc") => {
    if (field === undefined && order === undefined) {
      queryParams.delete("sortBy");
      queryParams.delete("sortOrder");
    } else {
      queryParams.set("sortBy", field);
      queryParams.set("sortOrder", order);
    }
    setQueryParams(queryParams);
  };

  const sortBy = useMemo(() => {
    const data = sortField
      ? [
          {
            id: sortField,
            desc: isSortOrderDesc
          }
        ]
      : [];
    return data;
  }, [sortField, isSortOrderDesc]);

  return (
    <DataTable
      stickyHead
      columns={columns}
      data={data}
      tableStyle={{ borderSpacing: "0" }}
      isLoading={isLoading}
      sortBy={sortBy}
      setSortOptions={setSortBy}
    />
  );
}
