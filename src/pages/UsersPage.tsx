import useUpdateUser, {
  useDeleteUser,
  useInviteUser
} from "@flanksource-ui/api/query-hooks/useUserAPI";
import { RegisteredUser } from "@flanksource-ui/api/types/users";
import UserForm from "@flanksource-ui/components/Users/UserForm";
import { SearchLayout } from "@flanksource-ui/ui/Layout/SearchLayout";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { FaCopy } from "react-icons/fa";
import { ImUserPlus } from "react-icons/im";
import { getRegisteredUsers } from "../api/services/users";
import { Button, Modal } from "../components";
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
  const [inviteLink, setInviteLink] = useState<string>();

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
    cacheTime: 0,
    staleTime: 0
  });

  const { mutate: inviteUserFunction, isLoading: isInviting } = useInviteUser({
    onSuccess: (data) => {
      refetch();
      setIsOpen(false);
      setInviteLink(data.link);
    },
    onError: (error) => {
      toastError(error.message);
    }
  });

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
          className="flex h-full flex-1 flex-col p-6 pb-0"
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
              isSubmitting={isInviting}
            />
          </Modal>

          {inviteLink && (
            <Modal
              title="Invite Link"
              onClose={() => {
                setInviteLink(undefined);
              }}
              open={!!inviteLink}
              bodyClass=""
            >
              <div className="flex flex-col gap-2 bg-white p-4 text-sm">
                <p>
                  User has been invited successfully. Please share the link with
                  the user.
                </p>
                <div className="relative flex flex-col space-y-4 py-3 text-blue-500">
                  <Button
                    className="btn-white absolute right-0 top-0 whitespace-pre-line bg-white text-black"
                    onClick={() => {
                      navigator.clipboard.writeText(inviteLink!);
                      toastSuccess("Link copied to clipboard");
                    }}
                    title="Copy Invite Link"
                  >
                    <FaCopy />
                  </Button>

                  {inviteLink}
                </div>
                <div className="flex flex-row justify-end gap-2">
                  <Button
                    className="btn-white"
                    onClick={() => {
                      setInviteLink(undefined);
                    }}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </Modal>
          )}

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
