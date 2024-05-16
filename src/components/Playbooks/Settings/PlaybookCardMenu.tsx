import { Float } from "@headlessui-float/react";
import { Menu } from "@headlessui/react";
import { DotsVerticalIcon } from "@heroicons/react/solid";
import { BsTrash } from "react-icons/bs";
import { MdEdit } from "react-icons/md";
import { IconButton } from "../../../ui/Buttons/IconButton";

type PlaybookCardMenuDropdownProps = {
  onDeletePlaybook?: () => void;
  onEditPlaybook?: () => void;
};

export default function PlaybookCardMenuDropdown({
  onDeletePlaybook = () => {},
  onEditPlaybook = () => {}
}: PlaybookCardMenuDropdownProps) {
  return (
    <Menu>
      <Float placement="bottom-end" portal>
        <Menu.Button className="p-0.5 min-w-7 rounded-full text-gray-400 hover:text-gray-500">
          <DotsVerticalIcon className="h-6 w-6" />
        </Menu.Button>
        <Menu.Items className="w-48 bg-white divide-y divide-gray-100 rounded-md shadow-card  focus:outline-none z-10 ">
          <Menu.Item
            as="div"
            className="flex items-center w-full text-gray-700 hover:bg-gray-200 p-3 cursor-pointer"
            onClick={() => {
              onEditPlaybook();
            }}
          >
            <>
              <IconButton
                className="bg-transparent group-hover:inline-block z-5 mr-2"
                ovalProps={{
                  stroke: "blue",
                  height: "18px",
                  width: "18px",
                  fill: "transparent"
                }}
                icon={
                  <MdEdit
                    className="text-gray-600 border-0 border-gray-200 border-l-1"
                    size={18}
                  />
                }
              />
              <span>Edit</span>
            </>
          </Menu.Item>
          <Menu.Item
            as="div"
            className="flex items-center gap-2 w-full text-gray-700 hover:bg-gray-200 p-3 cursor-pointer"
            onClick={() => {
              onDeletePlaybook();
            }}
          >
            <>
              <BsTrash
                className="text-gray-600 border-0 border-gray-200 border-l-1"
                size={18}
              />
              <span>Delete</span>
            </>
          </Menu.Item>
        </Menu.Items>
      </Float>
    </Menu>
  );
}
