import { Menu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useUser } from "../../context";
import { FaUserAlt } from "react-icons/fa";

import { CreateUserDialog } from "../CreateUserDialog";
import { SelectUserDialog } from "../SelectUserDialog";

export function UserProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectIsOpen, setSelectIsOpen] = useState(false);

  const { user } = useUser();

  const userNavigation = [
    { name: "Your Profile", href: "#" },
    { name: "Settings", href: "#" },
    { name: "Sign out", href: "#" }
  ];

  return (
    <>
      <CreateUserDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <SelectUserDialog
        isOpen={selectIsOpen}
        onClose={() => setSelectIsOpen(false)}
      />
      <Menu as="div" className="ml-3 relative flex-shrink-0">
        <div>
          <Menu.Button className="max-w-xs flex items-center text-sm rounded-full">
            <span className="sr-only">Open user menu</span>

            {user.avatar ? (
              <img
                className="h-8 w-8 rounded-full"
                src={user.avatar}
                alt={user.name}
              />
            ) : (
              <FaUserAlt size={24} />
            )}
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute bg-white focus:outline-none mt-2 opacity-100 origin-top-right right-0 ring-1 ring-black ring-opacity-5 rounded-md scale-100 shadow-lg shadow-md transform w-48">
            <Menu.Item>
              <span className="bg-slate-300 block bold border-0 border-b border-gray-400 broder-black px-4 py-2 rounded-t-md text-gray-600 text-lg">
                Hi <b>{user.name}</b>
              </span>
            </Menu.Item>
            <Menu.Item>
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="block w-full py-2 px-4 text-left text-sm text-gray-700  hover:bg-gray-50 hover:text-gray-900 border-0 border-b border-gray-200"
              >
                Switch to new user
              </button>
            </Menu.Item>
            <Menu.Item>
              <button
                type="button"
                onClick={() => setSelectIsOpen(true)}
                className="block w-full py-2 px-4 text-left text-sm text-gray-700  hover:bg-gray-50 hover:text-gray-900 border-0 border-b border-gray-200"
              >
                Switch user
              </button>
            </Menu.Item>
            {userNavigation.map((item) => (
              <Menu.Item key={item.name}>
                <a
                  href={item.href}
                  className="block py-2 px-4 text-sm text-gray-700  hover:bg-gray-50 hover:text-gray-900 border-0 border-b border-gray-200"
                >
                  {item.name}
                </a>
              </Menu.Item>
            ))}
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
}
