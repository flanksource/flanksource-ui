import React from "react";
import { Modal } from "../../ui/Modal";
import { Application } from "../../pages/applications/ApplicationsPage";
import ApplicationForm from "./ApplicationForm";

type ApplicationFormModalProps = React.HTMLProps<HTMLDivElement> & {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  onApplicationSubmit: (data: Application) => void;
  onApplicationDelete: (data: Application) => void;
  formValue?: Application;
  isSubmitting?: boolean;
  isDeleting?: boolean;
};

export default function ApplicationFormModal({
  className,
  isOpen,
  setIsOpen,
  onApplicationSubmit,
  onApplicationDelete,
  formValue,
  isSubmitting = false,
  isDeleting = false
}: ApplicationFormModalProps) {
  return (
    <Modal
      title={
        <div className="flex flex-row items-center gap-2 overflow-y-auto">
          <div className="text-lg font-semibold">
            {formValue?.id ? "Edit Application" : "Create Application"}
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
      <ApplicationForm
        onApplicationSubmit={onApplicationSubmit}
        onApplicationDelete={onApplicationDelete}
        formValue={formValue}
        className={className}
        isSubmitting={isSubmitting}
        isDeleting={isDeleting}
        handleBack={() => setIsOpen(false)}
      />
    </Modal>
  );
}
