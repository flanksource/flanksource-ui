import { CellContext, ColumnDef } from "@tanstack/table-core";
import { relativeDateTime } from "../../utils/date";

export const defaultTableColumns: ColumnDef<any>[] = [
  {
    header: "Type",
    accessorKey: "config_type",
    meta: {
      cellCLassName: "px-5 py-2"
    }
  },
  {
    header: "Name",
    accessorKey: "name",
    meta: {
      cellCLassName: "px-5 py-2"
    }
  },
  {
    header: "Tags",
    accessorKey: "tags",
    cell: TagsCell,
    meta: {
      cellCLassName: "px-5 py-2"
    }
  },
  {
    header: "Created",
    accessorKey: "created_at",
    cell: DateCell,
    meta: {
      cellCLassName: "px-5 py-2"
    }
  },
  {
    header: "Last Updated",
    accessorKey: "updated_at",
    cell: DateCell,
    meta: {
      cellCLassName: "px-5 py-2"
    }
  }
];

export function TagsCell({ row, column }: CellContext<any, any>): JSX.Element {
  const tags = row?.getValue<any[]>(column.id);

  return (
    <div className="flex">
      {tags?.length > 0 ? (
        tags?.map((tag) => (
          <div
            className="bg-gray-200 px-1 py-0.5 mr-1 rounded-md text-gray-600 font-semibold text-xs"
            key={tag}
          >
            {tag}
          </div>
        ))
      ) : (
        <span className="text-gray-400"></span>
      )}
    </div>
  );
}

export function DateCell({ row, column }: CellContext<any, any>) {
  const dateString = row?.getValue<string>(column.id);
  return (
    <div className="text-xs">
      {dateString ? relativeDateTime(dateString) : "None"}
    </div>
  );
}
