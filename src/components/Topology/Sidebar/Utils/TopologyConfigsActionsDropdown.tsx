import { Float } from "@headlessui-float/react";
import { Menu } from "@headlessui/react";
import { DotsVerticalIcon } from "@heroicons/react/solid";
import { Icon } from "../../../../ui/Icons/Icon";

type Props = {
  onUnlinkUser: () => void;
};

export default function TopologyConfigsActionsDropdown({
  onUnlinkUser = () => {}
}: Props) {
  return (
    <div className="flex flex-row justify-end items-center">
      <Menu>
        <Float placement="bottom-end" offset={10} portal>
          <Menu.Button className="p-0.5 min-w-7 rounded-full text-gray-400 hover:text-gray-500">
            <DotsVerticalIcon className="h-6 w-6" />
          </Menu.Button>
          <Menu.Items className="w-48 bg-white divide-y divide-gray-100 rounded-md shadow-card  focus:outline-none z-10 ">
            <Menu.Item
              as="button"
              className="flex gap-2 items-center w-full text-gray-700 hover:bg-gray-200 px-3 py-1.5 cursor-pointer"
              onClick={() => {
                onUnlinkUser();
              }}
            >
              <>
                <Icon
                  name="unlink"
                  className="text-gray-600 border-0 border-gray-200 border-l-1 h-4 align-middles"
                />
                <span> Unlink catalog</span>
              </>
            </Menu.Item>
          </Menu.Items>
        </Float>
      </Menu>
    </div>
  );
}
