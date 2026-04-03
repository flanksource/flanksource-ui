import { ErrorViewer } from "@flanksource-ui/components/ErrorViewer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@flanksource-ui/components/ui/dialog";
import clsx from "clsx";
import React from "react";
import { FaCircleNotch } from "react-icons/fa";

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
  error?: unknown;
  className?: string;
};

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
  error,
  className
}: ConfirmationPromptDialogProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className={clsx("sm:max-w-md", className)}>
        <DialogHeader>
          <div className="flex items-start gap-3 text-left">
            <div
              className={clsx(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
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
            <div className="flex-1">
              <DialogTitle className="text-base font-semibold text-gray-900">
                {title}
              </DialogTitle>
              <DialogDescription className="mt-2 text-sm text-gray-500">
                {description}
              </DialogDescription>
              {error ? (
                <div className="mt-3">
                  <ErrorViewer error={error} />
                </div>
              ) : null}
            </div>
          </div>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:justify-end">
          <button type="button" className="btn btn-white" onClick={onClose}>
            {closeLabel}
          </button>
          <button
            type="button"
            className={clsx(
              confirmationStyle === "delete" ? "btn-danger" : "btn-primary"
            )}
            onClick={() => {
              if (!isLoading) {
                onConfirm();
              }
            }}
            disabled={isLoading}
            aria-busy={isLoading}
            data-testid={`confirm-button-${yesLabel}`}
          >
            {isLoading && (
              <FaCircleNotch className="mr-1 inline animate-spin" />
            )}
            {yesLabel}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
