import { RegisteredUser } from "@flanksource-ui/api/types/users";
import { useUserAccessStateContext } from "@flanksource-ui/context/UserAccessContext/UserAccessContext";
import { tables } from "@flanksource-ui/context/UserAccessContext/permissions";
import { MRTDateCell } from "@flanksource-ui/ui/MRTDataTable/Cells/MRTDateCells";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { DotsVerticalIcon } from "@heroicons/react/solid";
import { MRT_ColumnDef, MRT_Row } from "mantine-react-table";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import { BiSolidEdit } from "react-icons/bi";
import { BsTrash } from "react-icons/bs";
import { IconButton } from "../../ui/Buttons/IconButton";
import { withAuthorizationAccessCheck } from "../Permissions/AuthorizationAccessCheck";

const userListColumns: MRT_ColumnDef<RegisteredUser>[] = [
  {
    header: "Name",
    accessorKey: "name",
    enableSorting: true
  },
  {
    header: "Email",
    accessorKey: "email",
    enableSorting: true
  },
  {
    header: "Roles",
    accessorKey: "roles",
    enableSorting: false,
    Cell: ({ row }) => {
      const roles = row.getValue<string[] | string | undefined>("roles");
      if (Array.isArray(roles)) {
        return roles.length > 0 ? roles.join(", ") : "-";
      }
      return roles || "-";
    }
  },
  {
    header: "State",
    accessorKey: "state",
    enableSorting: true
  },
  {
    header: "Last Login",
    accessorKey: "last_login",
    Cell: MRTDateCell,
    sortingFn: "datetime",
    enableSorting: true
  },
  {
    header: "Created At",
    accessorKey: "created_at",
    Cell: MRTDateCell,
    sortingFn: "datetime",
    enableSorting: true
  }
];

const getColumns = (
  deleteUser: (userId: string) => void,
  editUser: (user: RegisteredUser) => void,
  canDeleteUser: boolean
) => {
  if (canDeleteUser) {
    return [
      ...userListColumns,
      {
        header: "Actions",
        id: "actions",
        enableSorting: false,
        enableColumnActions: false,
        size: 50,
        Cell: ({ row }: { row: MRT_Row<RegisteredUser> }) => {
          const userId = row.original?.id;
          return (
            <ActionMenu
              deleteUser={() => {
                deleteUser(userId);
              }}
              editUser={() => {
                editUser(row.original);
              }}
            />
          );
        }
      }
    ];
  }
  return userListColumns;
};

function ActionMenu({
  deleteUser,
  editUser
}: {
  deleteUser: () => void;
  editUser: () => void;
}) {
  return withAuthorizationAccessCheck(
    <div
      className="relative"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <Menu>
        <MenuButton className="min-w-7 rounded-full p-0.5 text-gray-400 hover:text-gray-500">
          <DotsVerticalIcon className="h-6 w-6" />
        </MenuButton>
        <MenuItems
          portal
          anchor="bottom end"
          className="z-10 w-48 divide-y divide-gray-100 rounded-md bg-white shadow-card focus:outline-none"
        >
          <MenuItem
            as="div"
            className="flex w-full cursor-pointer items-center p-3 text-gray-700 hover:bg-gray-200"
            onClick={() => {
              editUser();
            }}
          >
            <>
              <IconButton
                className="z-5 mr-2 bg-transparent group-hover:inline-block"
                ovalProps={{
                  stroke: "blue",
                  height: "18px",
                  width: "18px",
                  fill: "transparent"
                }}
                icon={
                  <BiSolidEdit
                    className="border-l-1 border-0 border-gray-200 text-gray-600"
                    size={18}
                  />
                }
              />
              Edit User
            </>
          </MenuItem>
          <MenuItem
            as="div"
            className="flex w-full cursor-pointer items-center p-3 text-gray-700 hover:bg-gray-200"
            onClick={() => {
              deleteUser();
            }}
          >
            <>
              <IconButton
                className="z-5 mr-2 bg-transparent group-hover:inline-block"
                ovalProps={{
                  stroke: "blue",
                  height: "18px",
                  width: "18px",
                  fill: "transparent"
                }}
                icon={
                  <BsTrash
                    className="border-l-1 border-0 border-gray-200 text-gray-600"
                    size={18}
                  />
                }
              />
              Delete
            </>
          </MenuItem>
        </MenuItems>
      </Menu>
    </div>,
    tables.identities,
    "write"
  );
}

type UserListProps = {
  data: RegisteredUser[];
  isLoading?: boolean;
  deleteUser: (userId: string) => void;
  editUser: (user: RegisteredUser) => void;
} & Omit<React.HTMLProps<HTMLDivElement>, "data">;

export function UserList({
  data,
  isLoading,
  deleteUser,
  editUser,
  className,
  ...rest
}: UserListProps) {
  const { hasResourceAccess, roles } = useUserAccessStateContext();
  const [canDeleteUser, setCanDeleteUser] = useState(false);

  useEffect(() => {
    (async () => {
      const result = await hasResourceAccess(tables.identities, "write");
      setCanDeleteUser(result);
    })();
  }, [hasResourceAccess, roles]);

  const columns = useMemo(() => {
    return getColumns(deleteUser, editUser, canDeleteUser);
  }, [canDeleteUser, deleteUser, editUser]);

  return (
    <div className={clsx("min-h-0 flex-1", className)} {...rest}>
      <MRTDataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        onRowClick={(row) => editUser(row)}
      />
    </div>
  );
}
