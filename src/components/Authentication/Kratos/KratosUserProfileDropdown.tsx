import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { FaUserAlt } from "react-icons/fa";
import { useUser } from "../../../context";
import { ClickableSvg } from "../../../ui/ClickableSvg/ClickableSvg";
import { VersionInfo } from "../../VersionInfo/VersionInfo";
import KratosLogoutButton from "./KratosLogoutButton";

type UserProfileDropdownProps = {
  openKubeConfigModal: () => void;
};

export function KratosUserProfileDropdown({
  openKubeConfigModal
}: UserProfileDropdownProps) {
  const { user } = useUser();
  const userNavigation = [{ name: "Your Profile", href: "/profile-settings" }];

  return (
    <Menu as="div" className="relative ml-3 flex-shrink-0">
      <div>
        <Menu.Button className="flex items-center rounded-full text-sm">
          {user?.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
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
      {/* @ts-ignore */}
      <Transition
        as={Fragment as any}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-64 origin-top-right scale-100 transform rounded-md bg-white opacity-100 shadow-md ring-1 ring-black ring-opacity-5 focus:outline-none">
          <Menu.Item>
            <span className="bold broder-black block truncate rounded-t-md border-0 border-b border-gray-400 bg-slate-300 px-4 py-2 text-lg text-gray-600">
              Hi <b title={user?.name}>{user?.name}</b>
            </span>
          </Menu.Item>

          {userNavigation.map((item) => (
            <Menu.Item key={item.name}>
              <a
                href={item.href}
                className="block border-0 border-b border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              >
                {item.name}
              </a>
            </Menu.Item>
          ))}
          <Menu.Item>
            <button
              onClick={openKubeConfigModal}
              className="block border-0 border-b border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            >
              Download kubeconfig
            </button>
          </Menu.Item>
          <Menu.Item>
            <VersionInfo />
          </Menu.Item>
          <Menu.Item>
            <KratosLogoutButton />
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
