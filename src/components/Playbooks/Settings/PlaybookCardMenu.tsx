import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { DotsVerticalIcon } from "@heroicons/react/solid";
import { BsTrash } from "react-icons/bs";
import { MdEdit } from "react-icons/md";
import { IconButton } from "../../../ui/Buttons/IconButton";

type PlaybookCardMenuDropdownProps = {
  onDeletePlaybook?: () => void;
  onEditPlaybook?: () => void;
  onHistory?: () => void;
};

export default function PlaybookCardMenuDropdown({
  onDeletePlaybook = () => {},
  onEditPlaybook = () => {}
}: PlaybookCardMenuDropdownProps) {
  return (
    <Menu>
      <MenuButton className="min-w-7 rounded-full p-0.5 text-gray-400 hover:text-gray-500">
        <DotsVerticalIcon className="h-6 w-6" />
      </MenuButton>
      <MenuItems
        portal
        anchor="bottom end"
        className="z-10 w-48 divide-y divide-gray-100 rounded-md bg-white shadow-card focus:outline-none"
      >
        <MenuItem
          as="div"
          className="flex w-full cursor-pointer items-center p-3 text-gray-700 hover:bg-gray-200"
          onClick={() => {
            onEditPlaybook();
          }}
        >
          <>
            <IconButton
              className="z-5 mr-2 bg-transparent group-hover:inline-block"
              ovalProps={{
                stroke: "blue",
                height: "18px",
                width: "18px",
                fill: "transparent"
              }}
              icon={
                <MdEdit
                  className="border-l-1 border-0 border-gray-200 text-gray-600"
                  size={18}
                />
              }
            />
            <span>Edit</span>
          </>
        </MenuItem>
        <MenuItem
          as="div"
          className="flex w-full cursor-pointer items-center gap-2 p-3 text-gray-700 hover:bg-gray-200"
          onClick={() => {
            onDeletePlaybook();
          }}
        >
          <>
            <BsTrash
              className="border-l-1 border-0 border-gray-200 text-gray-600"
              size={18}
            />
            <span>Delete</span>
          </>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}
