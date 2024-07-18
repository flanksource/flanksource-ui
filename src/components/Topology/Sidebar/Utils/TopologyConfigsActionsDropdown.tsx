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
    <div className="flex flex-row items-center justify-end">
      <Menu>
        <Float placement="bottom-end" offset={10} portal>
          <Menu.Button className="min-w-7 rounded-full p-0.5 text-gray-400 hover:text-gray-500">
            <DotsVerticalIcon className="h-6 w-6" />
          </Menu.Button>
          <Menu.Items className="z-10 w-48 divide-y divide-gray-100 rounded-md bg-white shadow-card focus:outline-none">
            <Menu.Item
              as="button"
              className="flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-gray-700 hover:bg-gray-200"
              onClick={() => {
                onUnlinkUser();
              }}
            >
              <>
                <Icon
                  name="unlink"
                  className="border-l-1 align-middles h-4 border-0 border-gray-200 text-gray-600"
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
