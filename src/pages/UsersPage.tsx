import { useEffect, useRef, useState } from "react";
import { ImUserPlus } from "react-icons/im";
import {
  getRegisteredUsers,
  inviteUser,
  deleteUser,
  RegisteredUser,
  updateUserRole
} from "../api/services/users";
import { Modal } from "../components";
import { ConfirmationPromptDialog } from "../components/Dialogs/ConfirmationPromptDialog";
import { Head } from "../components/Head/Head";
import {
  InviteUserForm,
  InviteUserFormValue
} from "../components/InviteUserForm/InviteUserForm";
import { SearchLayout } from "../components/Layout";
import { toastError, toastSuccess } from "../components/Toast/toast";
import { UserList } from "../components/UserList";
import { useLoader } from "../hooks";
import { BreadcrumbNav, BreadcrumbRoot } from "../components/BreadcrumbNav";
import { MdAdminPanelSettings } from "react-icons/md";
import {
  ManageUserRoleValue,
  ManageUserRoles
} from "../components/ManageUserRoles/ManageUserRoles";
import { AccessCheck } from "../components/AccessCheck/AccessCheck";
import { tables } from "../context/UserAccessContext/permissions";

export function UsersPage() {
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] =
    useState<boolean>(false);
  const [deletedUserId, setDeletedUserId] = useState<string>();
  const [isOpen, setIsOpen] = useState(false);
  const [openRoleManageModal, setOpenRoleManageModal] = useState(false);
  const { loading, setLoading, idle } = useLoader();
  const containerRef = useRef<HTMLDivElement>(null);

  const onSubmit = async (val: InviteUserFormValue) => {
    try {
      await inviteUser({
        firstName: val.firstName,
        lastName: val.lastName,
        email: val.email
      });
      const users: RegisteredUser[] = await fetchUsersList();
      const userId = users.find((item) => item.email === val.email)?.id;
      if (userId) {
        await updateUserRole(userId, [val.role]);
      }
      const userName = `${val.firstName} ${val.lastName}`;
      toastSuccess(`${userName} invited successfully`);
      setIsOpen(false);
      fetchUsersList();
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
      fetchUsersList();
    } catch (ex) {
      toastError(ex as any);
    }
  };

  async function fetchUsersList() {
    let users: RegisteredUser[] = [];
    setLoading(true);
    try {
      const { data } = await getRegisteredUsers();
      users = data || [];
      setUsers(data || []);
    } catch (ex) {
      toastError(ex as any);
    }
    setLoading(false);
    return users;
  }

  async function deleteUserAction(userId: string | undefined) {
    if (!userId) {
      return;
    }
    try {
      const { data } = await deleteUser(userId);
      fetchUsersList();
      if (data) {
        toastSuccess(`user deleted successfully`);
      }
    } catch (ex: any) {
      toastError(ex);
    }
    setOpenDeleteConfirmDialog(false);
  }

  useEffect(() => {
    fetchUsersList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Head prefix="Users" />
      <SearchLayout
        title={
          <BreadcrumbNav
            list={[
              <BreadcrumbRoot link="/settings/users">Users</BreadcrumbRoot>
            ]}
          />
        }
        onRefresh={() => {
          fetchUsersList();
        }}
        contentClass="p-0 h-full"
        loading={loading}
      >
        <div
          className="flex flex-col flex-1 p-6 pb-0 h-full max-w-screen-xl mx-auto"
          ref={containerRef}
        >
          <div className="flex justify-end">
            <div className="flex flex-row space-x-4">
              <AccessCheck resource={tables.rbac} action="write">
                <button
                  className="btn-primary"
                  onClick={(e) => setOpenRoleManageModal(true)}
                >
                  <MdAdminPanelSettings className="mr-2 h-5 w-5" />
                  Add Role to User
                </button>
              </AccessCheck>
              <AccessCheck resource={tables.identities} action="write">
                <button
                  className="btn-primary"
                  onClick={(e) => setIsOpen(true)}
                >
                  <ImUserPlus className="mr-2 h-5 w-5" />
                  Invite User
                </button>
              </AccessCheck>
            </div>
          </div>
          <UserList
            className="mt-6 overflow-y-hidden"
            data={users}
            isLoading={loading || idle}
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
