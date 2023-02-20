import { Dialog } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import clsx from "clsx";

type ConfirmationPromptDialogProps = {
  isOpen: boolean;
  title: string;
  description: string;
  onClose: () => void;
  onConfirm: () => void;
  yesLabel?: string;
  closeLabel?: string;
} & React.HTMLProps<HTMLDivElement>;

export function ConfirmationPromptDialog({
  title,
  description,
  isOpen,
  onClose,
  onConfirm,
  yesLabel = "Delete",
  closeLabel = "Close",
  className,
  ...rest
}: ConfirmationPromptDialogProps) {
  return (
    // @ts-expect-error
    <Dialog
      open={isOpen}
      // @ts-expect-error
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
                onClick={onConfirm}
              >
                {yesLabel}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}
