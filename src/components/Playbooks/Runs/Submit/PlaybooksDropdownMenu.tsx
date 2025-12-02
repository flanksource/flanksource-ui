import { AuthorizationAccessCheck } from "@flanksource-ui/components/Permissions/AuthorizationAccessCheck";
import CollapsiblePanel from "@flanksource-ui/ui/CollapsiblePanel/CollapsiblePanel";
import { Icon } from "@flanksource-ui/ui/Icons/Icon";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { useMemo, useState } from "react";
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

  const playbooksGroupedByCategory = useMemo(
    () =>
      playbooks?.reduce(
        (acc, playbook) => {
          const category = playbook.spec?.category || "Uncategorized";
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(playbook);
          return acc;
        },
        {} as Record<
          string,
          (RunnablePlaybook & {
            spec: any;
          })[]
        >
      ),
    [playbooks]
  );

  if (error || playbooks?.length === 0 || isLoading) {
    return null;
  }

  return (
    <AuthorizationAccessCheck resource={"playbook_runs"} action={"write"}>
      <>
        <Popover className="group">
          <PopoverButton className="btn-white px-2 py-1">
            <Icon name="playbook" className="mr-2 mt-0.5 h-5 w-5" />
            Playbooks
            <ChevronDownIcon className="size-5 group-data-[open]:rotate-180" />
          </PopoverButton>
          <PopoverPanel
            portal
            className="menu-items absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            anchor="bottom start"
          >
            {playbooksGroupedByCategory && (
              <>
                {Object.entries(playbooksGroupedByCategory).map(
                  ([category, playbooks]) => (
                    <CollapsiblePanel
                      key={category}
                      Header={
                        <div className="flex flex-row items-center gap-2 text-sm text-gray-600">
                          {category}
                        </div>
                      }
                      iconClassName="h-4 w-4"
                      isCollapsed
                    >
                      <div className={`flex flex-col`}>
                        {playbooks.map((playbook) => (
                          <div
                            key={playbook.id}
                            onClick={() => {
                              setSelectedPlaybookSpec(playbook);
                            }}
                            className={`flex cursor-pointer flex-col justify-between gap-1 px-4 py-2 text-sm`}
                          >
                            <PlaybookSpecIcon playbook={playbook} showLabel />
                          </div>
                        ))}
                      </div>
                    </CollapsiblePanel>
                  )
                )}
              </>
            )}
          </PopoverPanel>
        </Popover>
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
      </>
    </AuthorizationAccessCheck>
  );
}
