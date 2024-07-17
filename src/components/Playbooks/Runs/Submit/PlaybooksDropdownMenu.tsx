import { AuthorizationAccessCheck } from "@flanksource-ui/components/Permissions/AuthorizationAccessCheck";
import { Float } from "@headlessui-float/react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { Fragment, useState } from "react";
import { FaCog } from "react-icons/fa";
import { useGetPlaybooksToRun } from "../../../../api/query-hooks/playbooks";
import { RunnablePlaybook } from "../../../../api/types/playbooks";
import PlaybookSpecIcon from "../../Settings/PlaybookSpecIcon";
import SubmitPlaybookRunForm from "./SubmitPlaybookRunForm";

type PlaybooksDropdownMenuProps = {
  component_id?: string;
  config_id?: string;
  check_id?: string;
  className?: string;
};

export default function PlaybooksDropdownMenu({
  check_id,
  component_id,
  config_id,
  className = "text-sm btn-white"
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
      <div className="text-right my-2">
        <Menu as="div" className="relative inline-block text-left">
          <Float placement="bottom-end" portal>
            <Menu.Button className="btn-white">
              <FaCog className="mr-2 h-4 w-4 mt-0.5" />
              Playbooks
              <ChevronDownIcon
                className="ml-2 -mr-1 h-5 w-5"
                aria-hidden="true"
              />
            </Menu.Button>

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
              <Menu.Items className="menu-items">
                {playbooks?.map((playbook) => (
                  <Menu.Item
                    as="button"
                    className="menu-item"
                    onClick={() => setSelectedPlaybookSpec(playbook)}
                    key={playbook.id}
                  >
                    <PlaybookSpecIcon playbook={playbook} showLabel />
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </Float>
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
