import { CellContext } from "@tanstack/react-table";
import { User } from "../../../api/types/users";
import { Avatar } from "../../Avatar";

export function UserCell<T extends User>({
  row,
  column,
  getValue
}: CellContext<T, unknown>) {
  return <Avatar user={row.original} circular />;
}

export function AvatarCell({
  row,
  column,
  getValue
}: CellContext<unknown, unknown>) {
  const user = getValue<User>();
  return <Avatar user={user} circular />;
}
