import {
  InviteUserForm,
  InviteUserFormValue
} from "@flanksource-ui/components/Users/InviteUserForm";
import { SearchLayout } from "@flanksource-ui/ui/Layout/SearchLayout";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { ImUserPlus } from "react-icons/im";
import { MdAdminPanelSettings } from "react-icons/md";
import {
  deleteUser,
  getRegisteredUsers,
  inviteUser,
  updateUserRole
} from "../api/services/users";
import { Modal } from "../components";
import { AuthorizationAccessCheck } from "../components/Permissions/AuthorizationAccessCheck";
import { toastError, toastSuccess } from "../components/Toast/toast";
import {
  ManageUserRoleValue,
  ManageUserRoles
} from "../components/Users/ManageUserRoles";
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
  const [openRoleManageModal, setOpenRoleManageModal] = useState(false);
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

  const onSubmit = async (val: InviteUserFormValue) => {
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
  };

  const onRoleSubmit = async (val: ManageUserRoleValue) => {
    try {
      await updateUserRole(val.userId, [val.role]);
      const user = users.find((item) => item.id === val.userId);
      toastSuccess(`${user!.name} role updated successfully`);
      setOpenRoleManageModal(false);
      refetch();
    } catch (ex) {
      toastError(ex as any);
    }
  };

  async function deleteUserAction(userId: string | undefined) {
    if (!userId) {
      return;
    }
    try {
      const { data } = await deleteUser(userId);
      refetch();
      if (data) {
        toastSuccess(`user deleted successfully`);
      }
    } catch (ex: any) {
      toastError(ex);
    }
    setOpenDeleteConfirmDialog(false);
  }

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
        loading={isLoading}
      >
        <div
          className="flex flex-col flex-1 p-6 pb-0 h-full max-w-screen-xl mx-auto"
          ref={containerRef}
        >
          <div className="flex justify-end">
            <div className="flex flex-row space-x-4">
              <AuthorizationAccessCheck resource={tables.rbac} action="write">
                <button
                  className="btn-primary"
                  onClick={(e) => setOpenRoleManageModal(true)}
                >
                  <MdAdminPanelSettings className="mr-2 h-5 w-5" />
                  Add Role to User
                </button>
              </AuthorizationAccessCheck>
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
            <InviteUserForm
              className="flex flex-col bg-white p-4"
              onSubmit={onSubmit}
              closeModal={() => setIsOpen(false)}
            />
          </Modal>
          <Modal
            title="Update User Role"
            onClose={() => {
              setOpenRoleManageModal(false);
            }}
            open={openRoleManageModal}
            bodyClass=""
          >
            <ManageUserRoles
              className="flex flex-col bg-white p-4"
              onSubmit={onRoleSubmit}
              registeredUsers={users}
              closeModal={() => setOpenRoleManageModal(false)}
            />
          </Modal>
          <ConfirmationPromptDialog
            isOpen={openDeleteConfirmDialog}
            title="Delete User ?"
            description="Are you sure you want to delete this user ?"
            onClose={() => setOpenDeleteConfirmDialog(false)}
            onConfirm={() => {
              deleteUserAction(deletedUserId);
            }}
          />
        </div>
      </SearchLayout>
    </>
  );
}
