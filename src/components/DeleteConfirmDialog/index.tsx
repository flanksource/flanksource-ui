import { Dialog } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import clsx from "clsx";

type DeleteConfirmDialogProps = {
  isOpen: boolean;
  title: string;
  description: string;
  onClose: () => void;
  onDelete: () => void;
  deleteLabel?: string;
  closeLabel?: string;
} & React.HTMLProps<HTMLDivElement>;

export function DeleteConfirmDialog({
  title,
  description,
  isOpen,
  onClose,
  onDelete,
  deleteLabel = "Delete",
  closeLabel = "Close",
  className,
  ...rest
}: DeleteConfirmDialogProps) {
  return (
    // @ts-ignore:next-line
    <Dialog
      open={isOpen}
      as="div"
      className={clsx("relative z-10", className)}
      onClose={onClose}
      {...rest}
    >
      <div className="fixed inset-0 bg-black bg-opacity-25" />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
            <Dialog.Title
              as="h3"
              className="text-lg font-medium leading-6 text-gray-900"
            >
              <div className="flex pointer-events-none sm:pointer-events-auto justify-between">
                <span>{title}</span>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={onClose}
                >
                  <span className="sr-only">Close</span>
                  <XIcon className="drop-shadow w-6 h-6" aria-hidden="true" />
                </button>
              </div>
            </Dialog.Title>
            <div className="mt-4">
              <p className="text-sm text-gray-500">{description}</p>
            </div>
            <div className="mt-4 space-x-4">
              <button className="btn-primary" onClick={onClose}>
                {closeLabel}
              </button>
              <button
                className="btn-secondary btn-secondary-base"
                onClick={onDelete}
              >
                {deleteLabel}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}
