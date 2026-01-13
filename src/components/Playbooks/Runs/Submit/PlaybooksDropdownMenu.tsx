import { AuthorizationAccessCheck } from "@flanksource-ui/components/Permissions/AuthorizationAccessCheck";
import { Icon } from "@flanksource-ui/ui/Icons/Icon";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import clsx from "clsx";
import { Fragment, useState } from "react";
import { useGetPlaybooksToRun } from "../../../../api/query-hooks/playbooks";
import { RunnablePlaybook } from "../../../../api/types/playbooks";
import PlaybookSpecIcon from "../../Settings/PlaybookSpecIcon";
import SubmitPlaybookRunForm from "./SubmitPlaybookRunForm";

type PlaybooksDropdownMenuProps = {
  component_id?: string;
  config_id?: string;
  check_id?: string;
  className?: string;
  containerClassName?: string;
};

export default function PlaybooksDropdownMenu({
  check_id,
  component_id,
  config_id,
  className = "",
  containerClassName = "my-2 text-right"
}: PlaybooksDropdownMenuProps) {
  const [selectedPlaybookSpec, setSelectedPlaybookSpec] = useState<
    RunnablePlaybook & {
      spec: any;
    }
  >();

  const {
    data: playbooks,
    isLoading,
    error
  } = useGetPlaybooksToRun({
    check_id,
    component_id,
    config_id
  });

  if (error || playbooks?.length === 0 || isLoading) {
    return null;
  }

  return (
    <AuthorizationAccessCheck resource={"playbook_runs"} action={"write"}>
      <div className={containerClassName}>
        <Menu as="div" className="relative inline-block text-left">
          <MenuButton className={clsx("btn-white px-2 py-1", className)}>
            <Icon name="playbook" className="mr-2 mt-0.5 h-5 w-5" />
            Playbooks
            <ChevronDownIcon
              className="-mr-1 ml-2 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </MenuButton>

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
            <MenuItems portal className="menu-items" anchor="bottom start">
              {playbooks?.map((playbook) => (
                <MenuItem
                  as="button"
                  className="menu-item w-full"
                  onClick={() => setSelectedPlaybookSpec(playbook)}
                  key={playbook.id}
                >
                  <PlaybookSpecIcon playbook={playbook} showLabel showTag />
                </MenuItem>
              ))}
            </MenuItems>
          </Transition>
        </Menu>
        {selectedPlaybookSpec && (
          <SubmitPlaybookRunForm
            componentId={component_id}
            checkId={check_id}
            configId={config_id}
            isOpen={!!selectedPlaybookSpec}
            onClose={() => {
              setSelectedPlaybookSpec(undefined);
            }}
            playbook={selectedPlaybookSpec}
          />
        )}
      </div>
    </AuthorizationAccessCheck>
  );
}
