import { PlaybookRunWithActions } from "@flanksource-ui/api/types/playbooks";
import { JSONViewer } from "@flanksource-ui/ui/Code/JSONViewer";
import { Modal } from "@flanksource-ui/ui/Modal";

type ViewPlaybookSpecModalProps = {
  data: PlaybookRunWithActions;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
};

export default function ViewPlaybookSpecModal({
  data,
  isModalOpen,
  setIsModalOpen
}: ViewPlaybookSpecModalProps) {
  return (
    <Modal
      open={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      title="Run details"
      size="large"
    >
      <div className="flex h-full flex-1 flex-col px-4 py-4">
        {data.playbooks?.spec && (
          <JSONViewer
            code={JSON.stringify(data.playbooks.spec, null, 2)}
            format="json"
            showLineNo
            convertToYaml
          />
        )}
      </div>
    </Modal>
  );
}
