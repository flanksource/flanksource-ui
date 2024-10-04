import { ConfigItem } from "@flanksource-ui/api/types/configs";
import ChangeCountIcon from "@flanksource-ui/ui/Icons/ChangeCount";
import { MRTCellProps } from "@flanksource-ui/ui/MRTDataTable/MRTCellProps";

export default function ConfigListChangeCell({
  row,
  column
}: MRTCellProps<ConfigItem>) {
  const changes = row?.getValue<ConfigItem["changes"]>(column.id);

  if (!changes) {
    return null;
  }

  return <ChangeCountIcon count={changes} />;
}
