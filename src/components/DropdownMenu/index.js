import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

// anchors: top-right top-left bottom-right bottom-left

export function DropdownMenu({
  buttonElement,
  className,
  anchor,
  content,
  dropdownClass,
  buttonClass
}) {
  return (
    <Menu as="div" className={`${className} relative flex-shrink-0`}>
      <Menu.Button className={`${buttonClass}`}>{buttonElement}</Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={`${dropdownClass} origin-${anchor} absolute mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 focus:outline-none`}
        >
          {content}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
