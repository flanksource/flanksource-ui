import { PlaybookSpec } from "@flanksource-ui/api/types/playbooks";
import PermissionsView from "@flanksource-ui/components/Permissions/PermissionsView";
import { Modal } from "@flanksource-ui/ui/Modal";
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
      containerClassName="h-full overflow-auto"
      bodyClass="flex w-full flex-1 flex-col gap-6 overflow-y-auto p-4"
      helpLink="playbooks"
    >
      <section className="rounded-md border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-4 py-3">
          <h3 className="text-base font-semibold text-gray-900">
            Who can run this playbook
          </h3>
          <p className="text-sm text-gray-500">
            Users, teams, playbooks, and other subjects that can run or approve
            this playbook.
          </p>
        </div>
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
      </section>

      <section className="rounded-md border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-4 py-3">
          <h3 className="text-base font-semibold text-gray-900">
            What this playbook can do
          </h3>
          <p className="text-sm text-gray-500">
            Permissions granted to this playbook as a subject (for example,
            reading a connection or running child playbooks).
          </p>
        </div>
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
      </section>
    </Modal>
  );
}
