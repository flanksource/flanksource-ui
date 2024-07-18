import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

type DropdownMenuProps = {
  buttonElement: JSX.Element;
  className?: string;
  anchor?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  content: JSX.Element;
  dropdownClass?: string;
  buttonClass?: string;
  menuDropdownStyle?: React.CSSProperties;
};

export function DropdownMenu({
  buttonElement,
  className,
  anchor,
  content,
  dropdownClass,
  buttonClass,
  menuDropdownStyle
}: DropdownMenuProps) {
  return (
    <Menu as="div" className={`${className} relative flex-shrink-0`}>
      <Menu.Button className={`${buttonClass}`}>{buttonElement}</Menu.Button>
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
        <Menu.Items
          style={menuDropdownStyle}
          className={`${dropdownClass} origin-${anchor} absolute mt-2 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
        >
          {content}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
