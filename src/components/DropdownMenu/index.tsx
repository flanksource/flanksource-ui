import { Menu, MenuButton, MenuItems } from "@headlessui/react";

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
      <MenuButton className={`${buttonClass}`}>{buttonElement}</MenuButton>

      <MenuItems
        style={menuDropdownStyle}
        className={`${dropdownClass} origin-${anchor} absolute mt-2 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
      >
        {content}
      </MenuItems>
    </Menu>
  );
}
