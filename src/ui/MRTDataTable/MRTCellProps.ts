import {
  MRT_Cell,
  MRT_Column,
  MRT_Row,
  MRT_TableInstance
} from "mantine-react-table";
import { ReactNode, RefObject } from "react";

export type MRTCellProps<TData extends Record<string, any> = {}> = {
  cell: MRT_Cell<TData>;
  renderedCellValue: number | string | ReactNode;
  column: MRT_Column<TData>;
  row: MRT_Row<TData>;
  rowRef?: RefObject<HTMLTableRowElement>;
  table: MRT_TableInstance<TData>;
};
