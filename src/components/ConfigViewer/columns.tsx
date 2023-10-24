import { ColumnDef } from "@tanstack/react-table";
import { DateCell } from "../../ui/table/DateCells";
import { TagsCell } from "../../ui/table/TagCell";

export const defaultTableColumns: ColumnDef<any>[] = [
  {
    header: "Type",
    accessorKey: "type",
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
