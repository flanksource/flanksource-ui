import { Float } from "@headlessui-float/react";
import { Fragment, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useGetPlaybooksToRun } from "../../../../api/query-hooks/playbooks";
import { Button } from "../../../Button";
import { Menu } from "@headlessui/react";
import { PlaybookSpec } from "../../Settings/PlaybookSpecsTable";
import SubmitPlaybookRunForm from "./SubmitPlaybookRunForm";

type SelectPlaybookToRunProps = {
  component_id?: string;
  config_id?: string;
  check_id?: string;
  className?: string;
};

export default function SelectPlaybookToRun({
  check_id,
  component_id,
  config_id,
  className = "text-sm btn-white"
}: SelectPlaybookToRunProps) {
  const [selectedPlaybookSpec, setSelectedPlaybookSpec] =
    useState<PlaybookSpec>();

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
    <div className="flex flex-col items-center p-1 relative">
      <Menu>
        <Float portal>
          <Menu.Button as={Fragment}>
            {({ open }) => (
              <div className="flex items-center">
                <Button
                  text={
                    <div className="flex flex-row gap-2">
                      <span>Playbooks</span>
                      {!open ? <FaChevronDown /> : <FaChevronUp />}
                    </div>
                  }
                  className={className}
                  disabled={isLoading}
                />
              </div>
            )}
          </Menu.Button>
          <Menu.Items
            as="div"
            className={`mt-2 origin-top-right w-56 bg-white divide-y divide-gray-100 rounded-md shadow-card  focus:outline-none z-10`}
          >
            {playbooks?.map((playbook) => (
              <Menu.Item
                className="flex text-left w-full text-gray-700 hover:bg-gray-200 hover:rounded-md p-1.5"
                as="button"
                onClick={() => setSelectedPlaybookSpec(playbook)}
                key={playbook.id}
              >
                {playbook.name}
              </Menu.Item>
            ))}
          </Menu.Items>
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
          playbookSpec={selectedPlaybookSpec}
        />
      )}
    </div>
  );
}
