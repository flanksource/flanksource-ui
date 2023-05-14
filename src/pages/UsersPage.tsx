import { useEffect, useState } from "react";
import { ImUserPlus } from "react-icons/im";
import {
  getRegisteredUsers,
  inviteUser,
  RegisteredUser,
  updateUserRole
} from "../api/services/users";
import { Modal } from "../components";
import { Head } from "../components/Head/Head";
import {
  InviteUserForm,
  InviteUserFormValue
} from "../components/InviteUserForm";
import { SearchLayout } from "../components/Layout";
import TableSkeletonLoader from "../components/SkeletonLoader/TableSkeletonLoader";
import { toastError, toastSuccess } from "../components/Toast/toast";
import { UserList } from "../components/UserList";
import { useLoader } from "../hooks";
import { BreadcrumbNav, BreadcrumbRoot } from "../components/BreadcrumbNav";
import { MdAdminPanelSettings } from "react-icons/md";
import {
  ManageUserRoleValue,
  ManageUserRoles
} from "../components/ManageUserRoles/ManageUserRoles";

export function UsersPage() {
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [openRoleManageModal, setOpenRoleManageModal] = useState(false);
  const { loading, setLoading } = useLoader();

  const onSubmit = async (val: InviteUserFormValue) => {
    try {
      await inviteUser(val);
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
    setLoading(true);
    try {
      const { data } = await getRegisteredUsers();
      setUsers(data || []);
    } catch (ex) {
      toastError(ex as any);
    }
    setLoading(false);
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
        <div className="flex flex-col flex-1 p-6 pb-0 h-full w-full">
          <div className="flex justify-end">
            <div className="flex flex-row space-x-4">
              <button
                className="btn-primary"
                onClick={(e) => setOpenRoleManageModal(true)}
              >
                <MdAdminPanelSettings className="mr-2 h-5 w-5" />
                Add Role to User
              </button>
              <button className="btn-primary" onClick={(e) => setIsOpen(true)}>
                <ImUserPlus className="mr-2 h-5 w-5" />
                Invite User
              </button>
            </div>
          </div>
          {loading && <TableSkeletonLoader />}
          {!loading && (
            <UserList
              className="mt-6 overflow-y-hidden"
              data={users}
              isLoading={loading}
            />
          )}
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
        </div>
      </SearchLayout>
    </>
  );
}
