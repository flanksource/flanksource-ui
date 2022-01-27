import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useUser } from "../../context";

export function UserProfile() {
  const user = useUser();
  const userNavigation = [
    { name: "Your Profile", href: "#" },
    { name: "Settings", href: "#" },
    { name: "Sign out", href: "#" }
  ];
  return (
    <Menu as="div" className="ml-3 relative">
      <div>
        <Menu.Button className="max-w-xs flex items-center text-sm rounded-full">
          <span className="sr-only">Open user menu</span>

          <img
            className="h-8 w-8 rounded-full"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt=""
          />
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
        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 focus:outline-none">
          <Menu.Item>
            <span className="block py-2 px-4 text-sm text-gray-400">
              {user.name}
            </span>
          </Menu.Item>
          {userNavigation.map((item) => (
            <Menu.Item key={item.name}>
              <a
                href={item.href}
                className="block py-2 px-4 text-sm text-gray-700  hover:bg-gray-50 hover:text-gray-900 "
              >
                {item.name}
              </a>
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
