import { Dialog } from "@headlessui/react";
import { useState, useEffect, useMemo } from "react";

import { useUser } from "../../context";
import { getPersons } from "../../api/services/users";
import { Dropdown } from "../Dropdown";

export function SelectUserDialog({ isOpen, onClose }) {
  const { user, setUser } = useUser();

  const [users, setUsers] = useState([]);

  useEffect(() => {
    getPersons().then((res) => {
      setUsers(res?.data);
    });
  }, []);

  const userOptions = useMemo(
    () =>
      Object.fromEntries(
        users.map(({ name, id }) => [
          id,
          { name, value: id, description: name }
        ])
      ),
    [users]
  );

  const onSelect = (id) => {
    const newUser = users.find((u) => u.id === id);
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
            <Dropdown value={user.id} onChange={onSelect} items={userOptions} />
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}
