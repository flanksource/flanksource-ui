import { Dialog } from "@headlessui/react";
import { useState, useEffect, useMemo } from "react";

import { useUser } from "../../context";
import { getPersons, User } from "../../api/services/users";
import { Dropdown } from "../Dropdown";
import { ReactSelectDropdown } from "../ReactSelectDropdown";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function SelectUserDialog({ isOpen, onClose }: Props) {
  const { user, setUser } = useUser();

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    getPersons().then((res) => {
      setUsers(res?.data);
    });
  }, []);

  const userOptions = useMemo(
    () =>
      Object.fromEntries(
        users?.map(({ name, id }) => [
          id,
          { name, value: id, description: name }
        ]) || []
      ),
    [users]
  );

  const onSelect = (id: string) => {
    const newUser = users.find((u) => u.id === id);
    if (!newUser) {
      console.warn("No such user", id);
      return;
    }
    setUser(newUser);
    onClose();
  };

  return (
    <Dialog as="div" className="relative z-10" open={isOpen} onClose={onClose}>
      <div className="fixed inset-0 bg-black bg-opacity-25" />

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Dialog.Panel className="bg-white p-4 rounded-md">
            <Dialog.Title className="text-left">Switch to user </Dialog.Title>
            <ReactSelectDropdown
              value={user?.id}
              onChange={onSelect}
              items={userOptions}
              value={user}
            />
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}
