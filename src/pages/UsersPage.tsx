import { useEffect, useState } from "react";
import { getRegisteredUsers, RegisteredUser } from "../api/services/users";
import { SearchLayout } from "../components/Layout";
import { toastError } from "../components/Toast/toast";
import { UserList } from "../components/UserList";
import { useLoader } from "../hooks";

export function UsersPage() {
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const { loading, setLoading } = useLoader();

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
