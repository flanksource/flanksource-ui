import { PlaybookSpec } from "@flanksource-ui/api/types/playbooks";
import { Modal } from "@flanksource-ui/ui/Modal";
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
      <PlaybookSpecsForm onClose={onClose} playbook={playbook} {...props} />
    </Modal>
  );
}
