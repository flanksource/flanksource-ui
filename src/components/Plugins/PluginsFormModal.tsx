import { ScrapePlugin } from "@flanksource-ui/api/services/scrapePlugins";
import { Modal } from "@flanksource-ui/ui/Modal";
import PluginsForm from "./PluginsForm";

type PluginsFormModalProps = Omit<
  React.HTMLProps<HTMLDivElement>,
  "onSubmit"
> & {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  onSubmit: (values: { name: string; spec: Record<string, any> }) => void;
  onDelete: (plugin: ScrapePlugin) => void;
  formValue?: ScrapePlugin;
  isSubmitting?: boolean;
  isDeleting?: boolean;
};

export default function PluginsFormModal({
  className,
  isOpen,
  setIsOpen,
  onSubmit,
  onDelete,
  formValue,
  isSubmitting = false,
  isDeleting = false
}: PluginsFormModalProps) {
  return (
    <Modal
      title={
        <div className="flex flex-row items-center gap-2 overflow-y-auto">
          <div className="text-lg font-semibold">
            {formValue?.id ? "Edit Plugin" : "Create Plugin"}
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
      <PluginsForm
        onSubmit={onSubmit}
        onDelete={onDelete}
        formValue={formValue}
        className={className}
        isSubmitting={isSubmitting}
        isDeleting={isDeleting}
        handleBack={() => setIsOpen(false)}
      />
    </Modal>
  );
}
