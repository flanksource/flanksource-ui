import { User } from "@flanksource-ui/api/types/users";
import { Avatar } from "@flanksource-ui/ui/Avatar";
import { MRTCellProps } from "../MRTCellProps";

export default function MRTAvatarCell<TData extends Record<string, any>>({
  row,
  column
}: MRTCellProps<TData>) {
  const user = row.getValue<User>(column.id);
  return <Avatar user={user} circular />;
}
