import { SilenceNotificationResponse } from "@flanksource-ui/api/types/notifications";
import { Modal } from "@flanksource-ui/ui/Modal";
import NotificationSilenceForm from "./NotificationSilenceForm";

type EditNotificationSilenceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
  data: SilenceNotificationResponse;
};

export default function EditNotificationSilenceModal({
  isOpen,
  onClose = () => {},
  data,
  onUpdate = () => {}
}: EditNotificationSilenceModalProps) {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Edit Notification Silence"
      size="medium"
    >
      <div className="flex flex-col gap-4">
        <NotificationSilenceForm
          data={data}
          footerClassName="bg-gray-100 p-4 flex flex-row justify-end gap-2"
          onSuccess={onUpdate}
          onCancel={onClose}
        />
      </div>
    </Modal>
  );
}
