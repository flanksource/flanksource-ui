import { PlaybookSpec } from "@flanksource-ui/api/types/playbooks";
import PermissionsView from "@flanksource-ui/components/Permissions/PermissionsView";
import { Modal } from "@flanksource-ui/ui/Modal";
import { Tab, Tabs } from "@flanksource-ui/ui/Tabs/Tabs";
import { useState } from "react";
import PlaybookSpecModalTitle from "../PlaybookSpecModalTitle";
import PlaybookSpecsForm from "./PlaybookSpecsForm";

type PlaybookSpecFormModalProps = {
  playbook?: PlaybookSpec;
  isOpen: boolean;
  onClose: () => void;
  refresh?: () => void;
};

export default function PlaybookSpecFormModal({
  playbook,
  isOpen,
  onClose,
  ...props
}: PlaybookSpecFormModalProps) {
  const [activeTab, setActiveTab] = useState<"form" | "permissions">("form");

  return (
    <Modal
      title={
        <PlaybookSpecModalTitle
          playbookSpec={playbook}
          defaultTitle="Create Playbook Spec"
        />
      }
      onClose={onClose}
      open={isOpen}
      size="full"
      containerClassName="h-full overflow-auto"
      bodyClass="flex flex-col w-full flex-1 h-full overflow-y-auto"
      helpLink="playbooks"
    >
      {playbook?.id ? (
        <Tabs
          activeTab={activeTab}
          onSelectTab={(label) => setActiveTab(label)}
        >
          <Tab label="Edit" value={"form"} className="flex flex-1 flex-col">
            <PlaybookSpecsForm
              onClose={onClose}
              {...props}
              playbook={playbook}
            />
          </Tab>

          <Tab
            label="Permissions"
            value={"permissions"}
            className="flex flex-1 flex-col"
          >
            <PermissionsView
              hideResourceColumn
              permissionRequest={{
                playbookId: playbook.id
              }}
              showAddPermission
              newPermissionData={{
                playbook_id: playbook.id
              }}
            />
          </Tab>
        </Tabs>
      ) : (
        <PlaybookSpecsForm onClose={onClose} {...props} />
      )}
    </Modal>
  );
}
