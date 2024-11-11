import { Dialog } from "@headlessui/react";
import React, { ComponentProps } from "react";
import { FaCircleNotch } from "react-icons/fa";
import { Modal } from "../Modal";
import clsx from "clsx";

export type ConfirmationPromptDialogProps = {
  isOpen: boolean;
  title: string;
  description: React.ReactNode;
  onClose: () => void;
  onConfirm: () => void;
  yesLabel?: string;
  closeLabel?: string;
  isLoading?: boolean;
  confirmationStyle?: "delete" | "approve";
} & ComponentProps<typeof Dialog>;

export function ConfirmationPromptDialog({
  title,
  confirmationStyle = "delete",
  description,
  isOpen,
  onClose,
  onConfirm,
  yesLabel = "Delete",
  closeLabel = "Cancel",
  isLoading = false,
  className,
  ...rest
}: ConfirmationPromptDialogProps) {
  return (
    <Modal
      hideCloseButton={true}
      open={isOpen}
      title={
        <div className="mt-4 sm:flex sm:items-start">
          <div
            className={clsx(
              "mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10",
              confirmationStyle === "delete" && "bg-red-100",
              confirmationStyle === "approve" && "bg-green-100"
            )}
          >
            {confirmationStyle === "delete" && (
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                ></path>
              </svg>
            )}
            {confirmationStyle === "approve" && (
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 12.75 6 6 9-13.5"
                ></path>
              </svg>
            )}
          </div>
          <div className="mb-3 mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
            <h3
              className="text-base font-semibold text-gray-900"
              id="modal-title"
            >
              {title}
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">{description}</p>
            </div>
          </div>
        </div>
      }
      titleClass="text-gray-900"
      titleHeaderClass=" px-4"
      size="very-small"
      onClose={onClose}
      {...rest}
    >
      <div className="flex flex-row bg-gray-100 p-3">
        <div className="flex flex-1 flex-row items-center justify-end space-x-4">
          <div className="flex flex-1 flex-row justify-end gap-2">
            <button className="btn btn-white" onClick={onClose}>
              {closeLabel}
            </button>
            <button
              className="btn-primary"
              onClick={onConfirm}
              data-testid={`confirm-button-${yesLabel}`}
            >
              {isLoading && (
                <FaCircleNotch className="mr-1 inline animate-spin" />
              )}
              {yesLabel}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
