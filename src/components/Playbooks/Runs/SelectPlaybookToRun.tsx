import { Fragment, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useGetPlaybooksToRun } from "../../../api/query-hooks/playbooks";
import { Button } from "../../Button";
import { Menu } from "../../Menu";
import { PlaybookSpec } from "../Settings/PlaybookSpecsTable";
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
        <Menu.Items>
          {playbooks?.map((playbook) => (
            <Menu.Item
              className="flex text-left w-full text-gray-700 hover:bg-gray-200 p-1.5"
              as="button"
              onClick={() => setSelectedPlaybookSpec(playbook)}
              key={playbook.ID}
            >
              {playbook.name}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Menu>
      {selectedPlaybookSpec && (
        <SubmitPlaybookRunForm
          type="component"
          componentId={component_id!}
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
