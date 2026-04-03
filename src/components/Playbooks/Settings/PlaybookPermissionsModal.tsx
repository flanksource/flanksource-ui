import { PlaybookSpec } from "@flanksource-ui/api/types/playbooks";
import PermissionsView from "@flanksource-ui/components/Permissions/PermissionsView";
import { Modal } from "@flanksource-ui/ui/Modal";
import FlatTabs from "@flanksource-ui/ui/Tabs/FlatTabs";
import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();

  const inboundPermissionRequest = useMemo(
    () => ({
      direction: "inbound" as const,
      playbookId: playbook.id,
      playbookName: playbook.name,
      playbookNamespace: playbook.namespace
    }),
    [playbook.id, playbook.name, playbook.namespace]
  );

  const outboundPermissionRequest = useMemo(
    () => ({
      direction: "outbound" as const,
      subject: playbook.id,
      subject_type: "playbook" as const
    }),
    [playbook.id]
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    queryClient.invalidateQueries({
      queryKey: ["permissions_summary", inboundPermissionRequest]
    });
    queryClient.invalidateQueries({
      queryKey: ["permissions_summary", outboundPermissionRequest]
    });
  }, [
    inboundPermissionRequest,
    isOpen,
    outboundPermissionRequest,
    queryClient
  ]);

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
        setActiveTab={(label) => {
          setActiveTab(label);

          const permissionRequest =
            label === "who-can-run"
              ? inboundPermissionRequest
              : outboundPermissionRequest;

          queryClient.invalidateQueries({
            queryKey: ["permissions_summary", permissionRequest]
          });
        }}
        contentClassName="px-4 pb-4"
        tabs={[
          {
            label: "Inbound",
            key: "who-can-run",
            current: activeTab === "who-can-run",
            content: (
              <PermissionsView
                hideResourceColumn
                permissionRequest={inboundPermissionRequest}
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
                hideSubjectColumn
                permissionRequest={outboundPermissionRequest}
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
