import { PlaybookSpec } from "@flanksource-ui/api/types/playbooks";
import PermissionsView from "@flanksource-ui/components/Permissions/PermissionsView";
import { Modal } from "@flanksource-ui/ui/Modal";
import FlatTabs from "@flanksource-ui/ui/Tabs/FlatTabs";
import { useState } from "react";
import PlaybookSpecModalTitle from "../PlaybookSpecModalTitle";

type PlaybookPermissionsModalProps = {
  playbook: PlaybookSpec;
  isOpen: boolean;
  onClose: () => void;
};

export default function PlaybookPermissionsModal({
  playbook,
  isOpen,
  onClose
}: PlaybookPermissionsModalProps) {
  const [activeTab, setActiveTab] = useState<"who-can-run" | "what-it-can-do">(
    "who-can-run"
  );

  return (
    <Modal
      title={
        <PlaybookSpecModalTitle
          playbookSpec={playbook}
          defaultTitle="Permissions"
        />
      }
      onClose={onClose}
      open={isOpen}
      size="full"
      containerClassName="h-full overflow-hidden"
      bodyClass="flex w-full min-h-0 flex-1 flex-col"
      helpLink="playbooks"
    >
      <FlatTabs
        activeTab={activeTab}
        setActiveTab={(label) => setActiveTab(label)}
        contentClassName="px-4 pb-4"
        tabs={[
          {
            label: "Inbound",
            key: "who-can-run",
            current: activeTab === "who-can-run",
            content: (
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
            )
          },
          {
            label: "Outbound",
            key: "what-it-can-do",
            current: activeTab === "what-it-can-do",
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
    </Modal>
  );
}
