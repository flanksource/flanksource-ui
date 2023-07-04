import { Menu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { FaUserAlt } from "react-icons/fa";
import { useUser } from "../../context";
import { ClickableSvg } from "../ClickableSvg/ClickableSvg";
import { CreateUserDialog } from "../CreateUserDialog";
import { SelectUserDialog } from "../SelectUserDialog";
import { VersionInfo } from "../VersionInfo/VersionInfo";
import { useCreateLogoutHandler } from "../ory";

export function UserProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectIsOpen, setSelectIsOpen] = useState(false);
  const onLogout = useCreateLogoutHandler([]);

  const { user } = useUser();

  const userNavigation = [{ name: "Your Profile", href: "/profile-settings" }];

  return (
    <>
      <CreateUserDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <SelectUserDialog
        isOpen={selectIsOpen}
        onClose={() => setSelectIsOpen(false)}
      />
      <Menu as="div" className="ml-3 relative flex-shrink-0">
        <div>
          {/* @ts-expect-error */}
          <Menu.Button className="flex items-center text-sm rounded-full">
            {user?.avatar ? (
              <img
                className="h-8 w-8 rounded-full"
                src={user.avatar}
                alt={user.name}
              />
            ) : (
              <ClickableSvg>
                <FaUserAlt size={24} />
              </ClickableSvg>
            )}
          </Menu.Button>
        </div>
        {/* @ts-expect-error */}
        <Transition
          // @ts-expect-error
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          {/* @ts-ignore */}
          <Menu.Items className="absolute bg-white focus:outline-none mt-2 opacity-100 origin-top-right right-0 ring-1 ring-black ring-opacity-5 rounded-md scale-100 shadow-md transform w-64">
            {/* @ts-expect-error */}
            <Menu.Item>
              <span className="truncate bg-slate-300 block bold border-0 border-b border-gray-400 broder-black px-4 py-2 rounded-t-md text-gray-600 text-lg">
                Hi <b title={user?.name}>{user?.name}</b>
              </span>
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
            <Menu.Item>
              <VersionInfo />
            </Menu.Item>
            <Menu.Item>
              <button
                type="button"
                onClick={onLogout}
                className="block w-full py-2 px-4 text-left text-sm text-gray-700  hover:bg-gray-50 hover:text-gray-900 border-0 border-b border-gray-200"
              >
                Sign out
              </button>
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
}
