import { useEffect, useState } from "react";
import { ImUserPlus } from "react-icons/im";
import {
  getRegisteredUsers,
  inviteUser,
  RegisteredUser
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

export function UsersPage() {
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [isOpen, setIsOpen] = useState(false);
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

  async function fetchUsersList() {
    setLoading(true);
    try {
      const { data } = await getRegisteredUsers();
      setUsers(data || []);
    } catch (ex) {
      toastError(ex);
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
            <button
              className="btn-primary w-36"
              onClick={(e) => setIsOpen(true)}
            >
              <ImUserPlus className="mr-2" />
              Invite User
            </button>
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
        </div>
      </SearchLayout>
    </>
  );
}
