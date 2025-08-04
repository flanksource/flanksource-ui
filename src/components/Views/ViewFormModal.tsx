import React from "react";
import { Modal } from "../../ui/Modal";
import { View } from "@flanksource-ui/api/services/views";
import ViewForm from "./ViewForm";

type ViewFormModalProps = React.HTMLProps<HTMLDivElement> & {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  onViewSubmit: (data: View) => void;
  onViewDelete: (data: View) => void;
  formValue?: View;
  isSubmitting?: boolean;
  isDeleting?: boolean;
};

export default function ViewFormModal({
  className,
  isOpen,
  setIsOpen,
  onViewSubmit,
  onViewDelete,
  formValue,
  isSubmitting = false,
  isDeleting = false
}: ViewFormModalProps) {
  return (
    <Modal
      title={
        <div className="flex flex-row items-center gap-2 overflow-y-auto">
          <div className="text-lg font-semibold">
            {formValue?.id ? "Edit View" : "Create View"}
          </div>
        </div>
      }
      onClose={() => {
        setIsOpen(false);
      }}
      open={isOpen}
      size="full"
      bodyClass="flex flex-col w-full flex-1 h-full overflow-y-auto"
      containerClassName="h-full overflow-auto"
    >
      <ViewForm
        onViewSubmit={onViewSubmit}
        onViewDelete={onViewDelete}
        formValue={formValue}
        className={className}
        isSubmitting={isSubmitting}
        isDeleting={isDeleting}
        handleBack={() => setIsOpen(false)}
      />
    </Modal>
  );
}
