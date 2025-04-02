import { PlaybookSpec } from "@flanksource-ui/api/types/playbooks";
import PermissionsView from "@flanksource-ui/components/Permissions/PermissionsView";
import { Modal } from "@flanksource-ui/ui/Modal";
import FlatTabs from "@flanksource-ui/ui/Tabs/FlatTabs";
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
        <FlatTabs
          activeTab={activeTab}
          setActiveTab={(label) => setActiveTab(label)}
          tabs={[
            {
              label: "Edit Playbook Spec",
              key: "form",
              current: activeTab === "form",
              content: (
                <PlaybookSpecsForm
                  onClose={onClose}
                  {...props}
                  playbook={playbook}
                />
              )
            },
            {
              label: "Permissions",
              key: "permissions",
              current: activeTab === "permissions",
              content: (
                <PermissionsView
                  hideResourceColumn
                  permissionRequest={{
                    subject: playbook.id,
                    subject_type: "playbook"
                  }}
                  showAddPermission
                  newPermissionData={{
                    subject: playbook.id,
                    subject_type: "playbook"
                  }}
                />
              )
            }
          ]}
        />
      ) : (
        <PlaybookSpecsForm onClose={onClose} {...props} />
      )}
    </Modal>
  );
}
