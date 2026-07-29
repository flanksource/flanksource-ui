import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { DotsVerticalIcon } from "@heroicons/react/solid";
import { BsTrash } from "react-icons/bs";
import { MdEdit, MdSecurity, MdVisibility } from "react-icons/md";
import { IconButton } from "../../../ui/Buttons/IconButton";

type PlaybookCardMenuDropdownProps = {
  onDeletePlaybook?: () => void;
  onEditPlaybook?: () => void;
  onManagePermissions?: () => void;
  onHistory?: () => void;
  isReadOnly?: boolean;
};

export default function PlaybookCardMenuDropdown({
  onDeletePlaybook = () => {},
  onEditPlaybook = () => {},
  onManagePermissions = () => {},
  isReadOnly = false
}: PlaybookCardMenuDropdownProps) {
  return (
    <Menu>
      <MenuButton
        aria-label="Playbook options"
        className="min-w-7 rounded-full p-0.5 text-gray-400 hover:text-gray-500"
      >
        <DotsVerticalIcon className="h-6 w-6" />
      </MenuButton>
      <MenuItems
        portal
        anchor="bottom end"
        className="z-10 w-48 divide-y divide-gray-100 rounded-md border border-gray-200 bg-white shadow-card focus:outline-none"
      >
        <MenuItem
          as="div"
          className="flex w-full cursor-pointer items-center px-3 py-1.5 text-sm leading-5 text-gray-700 hover:bg-gray-200"
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
                isReadOnly ? (
                  <MdVisibility
                    className="border-l-1 border-0 border-gray-200 text-gray-600"
                    size={16}
                  />
                ) : (
                  <MdEdit
                    className="border-l-1 border-0 border-gray-200 text-gray-600"
                    size={16}
                  />
                )
              }
            />
            <span>{isReadOnly ? "View" : "Edit"}</span>
          </>
        </MenuItem>
        <MenuItem
          as="div"
          className="flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-sm leading-5 text-gray-700 hover:bg-gray-200"
          onClick={() => {
            onManagePermissions();
          }}
        >
          <>
            <MdSecurity
              className="border-l-1 border-0 border-gray-200 text-gray-600"
              size={16}
            />
            <span>Permissions</span>
          </>
        </MenuItem>
        {!isReadOnly && (
          <MenuItem
            as="div"
            className="flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-sm leading-5 text-gray-700 hover:bg-gray-200"
            onClick={() => {
              onDeletePlaybook();
            }}
          >
            <>
              <BsTrash
                className="border-l-1 border-0 border-gray-200 text-gray-600"
                size={16}
              />
              <span>Delete</span>
            </>
          </MenuItem>
        )}
      </MenuItems>
    </Menu>
  );
}
