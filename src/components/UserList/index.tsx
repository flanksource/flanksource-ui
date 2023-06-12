import { CellContext } from "@tanstack/table-core";
import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
import { BsTrash } from "react-icons/bs";
import { User } from "../../api/services/users";
import { relativeDateTime } from "../../utils/date";
import { DataTable } from "../DataTable";
import { IconButton } from "../IconButton";
import { Menu } from "../Menu";
import { withAccessCheck } from "../AccessCheck/AccessCheck";
import { tables } from "../../context/UserAccessContext/permissions";
import { useUserAccessStateContext } from "../../context/UserAccessContext/UserAccessContext";

type UserListProps = {
  data: any[];
  isLoading?: boolean;
  deleteUser: (userId: string) => void;
} & Omit<React.HTMLProps<HTMLDivElement>, "data">;

const DateCell = ({ getValue }: CellContext<User, any>) =>
  relativeDateTime(getValue<string>());

const getColumns = (
  deleteUser: (userId: string) => void,
  canDeleteUser: boolean
) => {
  let columns = [
    {
      header: "Name",
      accessorKey: "name"
    },
    {
      header: "Email",
      accessorKey: "email",
      Aggregated: ""
    },
    {
      header: "Roles",
      accessorKey: "roles",
      size: 50,
      aggregatedCell: ""
    },
    {
      header: "State",
      accessorKey: "state",
      size: 50,
      aggregatedCell: ""
    },
    {
      header: "Created At",
      accessorKey: "created_at",
      cell: DateCell,
      sortType: "datetime",
      size: 80,
      Aggregated: ""
    }
  ];
  if (canDeleteUser) {
    return [
      ...columns,
      {
        header: "Actions",
        accessorKey: "actions",
        Aggregated: "",
        size: 50,
        cell: ({ row }: any) => {
          const userId = row.original?.id;
          return (
            <ActionMenu
              deleteUser={() => {
                deleteUser(userId);
              }}
            />
          );
        }
      }
    ];
  }
  return columns;
};

function ActionMenu({ deleteUser }: { deleteUser: () => void }) {
  return withAccessCheck(
    <div className="relative">
      <Menu>
        <Menu.VerticalIconButton />
        <Menu.Items widthClass="w-48 right-16">
          <Menu.Item
            onClick={() => {
              deleteUser();
            }}
          >
            <IconButton
              className="bg-transparent group-hover:inline-block z-5 mr-2"
              ovalProps={{
                stroke: "blue",
                height: "18px",
                width: "18px",
                fill: "transparent"
              }}
              icon={
                <BsTrash
                  className="text-gray-600 border-0 border-gray-200 border-l-1"
                  size={18}
                />
              }
            />
            Delete
          </Menu.Item>
        </Menu.Items>
      </Menu>
    </div>,
    tables.identities,
    "write"
  );
}

export function UserList({
  data,
  isLoading,
  deleteUser,
  className,
  ...rest
}: UserListProps) {
  const { hasResourceAccess, roles } = useUserAccessStateContext();
  const [canDeleteUser, setCanDeleteUser] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const result = await hasResourceAccess(tables.identities, "write");
      setCanDeleteUser(result);
    })();
  }, [roles]);

  const columns = useMemo(() => {
    return getColumns(deleteUser, canDeleteUser);
  }, [canDeleteUser]);

  return (
    <div className={clsx(className)} {...rest} ref={containerRef}>
      <DataTable
        stickyHead
        columns={columns}
        data={data}
        tableStyle={{ borderSpacing: "0" }}
        isLoading={isLoading}
        style={{
          height: `calc(100vh - ${
            containerRef.current?.getBoundingClientRect()?.top ?? 0
          }px)`
        }}
        preferencesKey="user-list"
        savePreferences={false}
      />
    </div>
  );
}
