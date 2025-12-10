import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition
} from "@headlessui/react";
import { Fragment } from "react";
import { FaUserAlt } from "react-icons/fa";
import { useUser } from "../../../context";
import { ClickableSvg } from "../../../ui/ClickableSvg/ClickableSvg";
import { VersionInfo } from "../../VersionInfo/VersionInfo";
import KratosLogoutButton from "./KratosLogoutButton";

type UserProfileDropdownProps = {
  openKubeConfigModal: () => void;
  openMcpTokenModal: () => void;
};

export function KratosUserProfileDropdown({
  openKubeConfigModal,
  openMcpTokenModal
}: UserProfileDropdownProps) {
  const { user } = useUser();
  const userNavigation = [{ name: "Your Profile", href: "/profile-settings" }];

  return (
    <Menu as="div" className="relative flex-shrink-0">
      <div>
        <MenuButton className="flex items-center rounded-full text-sm">
          {user?.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="h-4 w-4 rounded-full"
              src={user.avatar}
              alt={user.name}
            />
          ) : (
            <ClickableSvg>
              <FaUserAlt className="h-4 w-4" />
            </ClickableSvg>
          )}
        </MenuButton>
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
        <MenuItems className="absolute right-0 mt-2 w-64 origin-top-right scale-100 transform rounded-md bg-white opacity-100 shadow-md ring-1 ring-black ring-opacity-5 focus:outline-none">
          <MenuItem>
            <span className="bold broder-black block truncate rounded-t-md border-0 border-b border-gray-400 bg-slate-300 px-4 py-2 text-lg text-gray-600">
              Hi <b title={user?.name}>{user?.name}</b>
            </span>
          </MenuItem>

          {userNavigation.map((item) => (
            <MenuItem key={item.name}>
              <a
                href={item.href}
                className="block border-0 border-b border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              >
                {item.name}
              </a>
            </MenuItem>
          ))}
          <MenuItem>
            <button
              onClick={openKubeConfigModal}
              className="block border-0 border-b border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            >
              Download kubeconfig
            </button>
          </MenuItem>
          <MenuItem>
            <button
              onClick={openMcpTokenModal}
              className="block border-0 border-b border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            >
              Setup MCP
            </button>
          </MenuItem>
          <MenuItem>
            <VersionInfo />
          </MenuItem>
          <MenuItem>
            <KratosLogoutButton />
          </MenuItem>
        </MenuItems>
      </Transition>
    </Menu>
  );
}
