import { useEffect, useState } from "react";
import { getRegisteredUsers } from "../api/services/users";
import { SearchLayout } from "../components/Layout";
import { toastError } from "../components/Toast/toast";
import { UserList } from "../components/UserList";
import { useLoader } from "../hooks";

export function UsersPage() {
  const [users, setUsers] = useState<any>([]);
  const { loading, setLoading } = useLoader();

  async function fetchUsersList() {
    setLoading(true);
    try {
      const { data } = await getRegisteredUsers();
      const usersList = data?.map((item) => {
        return {
          id: item.id,
          created_at: new Date(item.created_at),
          state: item.state,
          state_changed_at: new Date(item.state_changed_at),
          updated_at: new Date(item.updated_at),
          name: `${item.traits?.name?.first ?? ""} ${
            item.traits?.name?.last ?? ""
          }`,
          email: item.traits.email
        };
      });
      setUsers(usersList);
    } catch (ex) {
      console.log(ex);
      toastError(ex);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchUsersList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SearchLayout
      title={<div className="flex text-xl font-semibold">Users</div>}
      onRefresh={() => {
        fetchUsersList();
      }}
      contentClass="p-0 h-full"
      loading={loading}
    >
      <div className="flex flex-col flex-1 p-6 pb-0 h-full w-full">
        <UserList data={users} isLoading={loading} />
      </div>
    </SearchLayout>
  );
}
