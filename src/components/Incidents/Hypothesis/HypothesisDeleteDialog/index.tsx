import { Dialog } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  onDisprove: () => void;
}

export function HypothesisDeleteDialog({
  isOpen,
  onClose = () => {},
  onDisprove,
  onDelete
}: IProps) {
  return (
    <Dialog open={isOpen} as="div" className="relative z-10" onClose={onClose}>
      <div className="fixed inset-0 bg-black bg-opacity-25" />

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
            <Dialog.Title
              as="h3"
              className="text-lg font-medium leading-6 text-gray-900"
            >
              <div className="pointer-events-none flex justify-between sm:pointer-events-auto">
                <span>Delete hypothesis? </span>
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
              <p className="text-sm text-gray-500">
                Are you sure you want to delete the hypothesis or would you
                rather mark this hypothesis as Disproven.
              </p>
            </div>

            <div className="mt-4 space-x-4">
              <button className="btn-primary" onClick={onDisprove}>
                Disprove Hypothesis
              </button>

              <button
                className="btn-secondary btn-secondary-base"
                onClick={onDelete}
              >
                Delete Hypothesis
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}
