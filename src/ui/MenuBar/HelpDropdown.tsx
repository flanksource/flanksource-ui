import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { IoHelpOutline } from "react-icons/io5";
import { ClickableSvg } from "../ClickableSvg/ClickableSvg";

export function HelpDropdown() {
  return (
    <Menu as="div" className="relative ml-3 flex-shrink-0">
      <div>
        <Menu.Button className="flex items-center rounded-full text-sm text-gray-400">
          <ClickableSvg>
            <IoHelpOutline size={24} />
          </ClickableSvg>
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
            <a
              href="https://docs.flanksource.com/"
              target="_blank"
              className="block space-x-2 border-0 border-b border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              rel="noreferrer"
            >
              <span>Docs</span>
            </a>
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
