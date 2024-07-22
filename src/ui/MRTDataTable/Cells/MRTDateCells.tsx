import { Age } from "@flanksource-ui/ui/Age";
import { MRTCellProps } from "../MRTCellProps";

export function MRTDateCell<TData extends Record<string, any>>({
  row,
  column
}: MRTCellProps<TData>) {
  const dateString = row?.getValue<string>(column.id);
  return (
    <div className="text-xs">
      <Age from={dateString} />
    </div>
  );
}
