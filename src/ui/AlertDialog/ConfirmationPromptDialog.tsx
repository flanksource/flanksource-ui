import { Dialog } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import clsx from "clsx";
import React, { ComponentProps } from "react";
import { FaCircleNotch } from "react-icons/fa";

type ConfirmationPromptDialogProps = {
  isOpen: boolean;
  title: string;
  description: React.ReactNode;
  onClose: () => void;
  onConfirm: () => void;
  yesLabel?: string;
  closeLabel?: string;
  isLoading?: boolean;
} & ComponentProps<typeof Dialog>;

export function ConfirmationPromptDialog({
  title,
  description,
  isOpen,
  onClose,
  onConfirm,
  yesLabel = "Delete",
  closeLabel = "Close",
  isLoading = false,
  className,
  ...rest
}: ConfirmationPromptDialogProps) {
  return (
    <Dialog
      open={isOpen}
      as={"div" as any}
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
              <div className="pointer-events-none flex justify-between sm:pointer-events-auto">
                <span>{title}</span>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={onClose}
                >
                  <span className="sr-only">Close</span>
                  <XIcon className="h-6 w-6 drop-shadow" aria-hidden="true" />
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
                data-testid="confirm-button"
              >
                {isLoading && (
                  <FaCircleNotch className="mr-1 inline animate-spin" />
                )}
                {yesLabel}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}
