import { relativeDateTime } from "../../utils/date";
import { DataTable } from "../DataTable";

type UserListProps = {
  data: any[];
  isLoading?: boolean;
};

const DateCell = ({ cell: { value } }: { cell: { value: Date } }) =>
  relativeDateTime(value);

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
  return (
    <DataTable
      stickyHead
      columns={columns}
      data={data}
      tableStyle={{ borderSpacing: "0" }}
      isLoading={isLoading}
      usageSection="user-list"
    />
  );
}
