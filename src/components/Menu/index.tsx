import { Menu as HLMenu, Transition } from "@headlessui/react";
import { DotsVerticalIcon } from "@heroicons/react/outline";
import { Fragment } from "react";
import { $ElementProps } from "../../types/utility";

type ItemProps = Partial<$ElementProps<typeof HLMenu.Item>>;

const Item = ({ children, ...props }: ItemProps) => (
  <HLMenu.Item
    as="div"
    className="flex items-center w-full text-gray-700 hover:bg-gray-200 p-3"
    {...props}
  >
    {children}
  </HLMenu.Item>
);

type ItemsProps = Partial<$ElementProps<typeof HLMenu.Items>>;
const Items = ({ children }: ItemsProps) => (
  <Transition
    as={Fragment}
    enter="transition ease-out duration-100"
    enterFrom="transform opacity-0 scale-95"
    enterTo="transform opacity-100 scale-100"
    leave="transition ease-in duration-75"
    leaveFrom="transform opacity-100 scale-100"
    leaveTo="transform opacity-0 scale-95"
  >
    <HLMenu.Items className="absolute right-0 top-full w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-card  focus:outline-none z-10 ">
      {children}
    </HLMenu.Items>
  </Transition>
);

type VerticalIconButtonProps = Partial<$ElementProps<typeof HLMenu.Button>>;
const VerticalIconButton = (_props: VerticalIconButtonProps) => (
  <HLMenu.Button className="p-0.5 min-w-7 rounded-full text-gray-400 hover:text-gray-500">
    <DotsVerticalIcon className="h-6 w-6" />
  </HLMenu.Button>
);

type MenuProps = Partial<$ElementProps<typeof HLMenu>>;
const MenuC = ({ children }: MenuProps) => (
  <HLMenu as="div" className="relative flex flex-initial">
    {children}
  </HLMenu>
);

export const Menu = Object.assign(MenuC, {
  Item: Item,
  Items: Items,
  VerticalIconButton: VerticalIconButton
});
