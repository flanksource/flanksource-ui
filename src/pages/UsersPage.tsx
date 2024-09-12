import useUpdateUser, {
  useDeleteUser
} from "@flanksource-ui/api/query-hooks/useUserAPI";
import { RegisteredUser } from "@flanksource-ui/api/types/users";
import UserForm, {
  UserFormValue
} from "@flanksource-ui/components/Users/UserForm";
import { SearchLayout } from "@flanksource-ui/ui/Layout/SearchLayout";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useRef, useState } from "react";
import { ImUserPlus } from "react-icons/im";
import {
  getRegisteredUsers,
  inviteUser,
  updateUserRole
} from "../api/services/users";
import { Modal } from "../components";
import { AuthorizationAccessCheck } from "../components/Permissions/AuthorizationAccessCheck";
import { toastError, toastSuccess } from "../components/Toast/toast";
import { UserList } from "../components/Users/UserList";
import { tables } from "../context/UserAccessContext/permissions";
import { ConfirmationPromptDialog } from "../ui/AlertDialog/ConfirmationPromptDialog";
import { BreadcrumbNav, BreadcrumbRoot } from "../ui/BreadcrumbNav";
import { Head } from "../ui/Head";

export function UsersPage() {
  const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] =
    useState<boolean>(false);
  const [deletedUserId, setDeletedUserId] = useState<string>();
  const [isOpen, setIsOpen] = useState(false);
  const [editUser, setEditUser] = useState<RegisteredUser>();
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    isLoading,
    data: users = [],
    refetch
  } = useQuery({
    queryKey: ["users", "list", "settings"],
    queryFn: () => getRegisteredUsers(),
    select: (data) => {
      return data.data || [];
    },
    cacheTime: 0
  });

  const inviteUserFunction = useCallback(
    async (val: UserFormValue) => {
      try {
        await inviteUser({
          firstName: val.firstName,
          lastName: val.lastName,
          email: val.email
        });
        const userId = users.find((item) => item.email === val.email)?.id;
        if (userId) {
          await updateUserRole(userId, [val.role]);
          return;
        }
        const userName = `${val.firstName} ${val.lastName}`;
        toastSuccess(`${userName} invited successfully`);
        setIsOpen(false);
        refetch();
      } catch (ex) {
        toastError(ex as any);
      }
    },
    [refetch, users]
  );

  const { mutate: deleteUserFunction, isLoading: isDeleting } = useDeleteUser({
    onSuccess: () => {
      refetch();
      toastSuccess(`user deleted successfully`);
    },
    onError: (error) => {
      toastError(error);
    },
    onSettled: () => {
      setOpenDeleteConfirmDialog(false);
    }
  });

  const { mutate: updateUserFunction, isLoading: updatingUser } = useUpdateUser(
    {
      onSuccess: (user) => {
        setEditUser(undefined);
        refetch();
        const userName = `${user?.name.first} ${user?.name.last}`;
        toastSuccess(`${userName} updated successfully`);
      },
      onError: (error) => {
        toastError(error);
      }
    }
  );

  return (
    <>
      <Head prefix="Users" />
      <SearchLayout
        title={
          <BreadcrumbNav
            list={[
              <BreadcrumbRoot key="setting-users" link="/settings/users">
                Users
              </BreadcrumbRoot>
            ]}
          />
        }
        onRefresh={refetch}
        contentClass="p-0 h-full"
        loading={isLoading || updatingUser}
      >
        <div
          className="mx-auto flex h-full max-w-screen-xl flex-1 flex-col p-6 pb-0"
          ref={containerRef}
        >
          <div className="flex justify-end">
            <div className="flex flex-row space-x-4">
              <AuthorizationAccessCheck
                resource={tables.identities}
                action="write"
              >
                <button
                  className="btn-primary"
                  onClick={(e) => setIsOpen(true)}
                >
                  <ImUserPlus className="mr-2 h-5 w-5" />
                  Invite User
                </button>
              </AuthorizationAccessCheck>
            </div>
          </div>
          <UserList
            className="mt-6 overflow-y-hidden"
            data={users}
            isLoading={isLoading}
            style={{
              height: `calc(100vh - ${
                containerRef.current?.getBoundingClientRect()?.top ?? 0
              }px)`
            }}
            editUser={(user) => setEditUser(user)}
            deleteUser={(userId) => {
              setDeletedUserId(userId);
              setOpenDeleteConfirmDialog(true);
            }}
          />
          <Modal
            title="Invite User"
            onClose={() => {
              setIsOpen(false);
            }}
            open={isOpen}
            bodyClass=""
          >
            <UserForm
              className="flex flex-col bg-white p-4"
              onSubmit={inviteUserFunction}
              onClose={() => setIsOpen(false)}
            />
          </Modal>

          {editUser && (
            <Modal
              title="Edit User"
              onClose={() => {
                setEditUser(undefined);
              }}
              open={!!editUser}
              bodyClass=""
            >
              <UserForm
                className="flex flex-col bg-white p-4"
                onSubmit={updateUserFunction}
                isSubmitting={updatingUser}
                onClose={() => {
                  setEditUser(undefined);
                }}
                user={editUser}
              />
            </Modal>
          )}

          <ConfirmationPromptDialog
            isOpen={openDeleteConfirmDialog}
            title="Delete User ?"
            description="Are you sure you want to delete this user ?"
            onClose={() => setOpenDeleteConfirmDialog(false)}
            isLoading={isDeleting}
            onConfirm={() => {
              deleteUserFunction({ id: deletedUserId! });
            }}
          />
        </div>
      </SearchLayout>
    </>
  );
}
