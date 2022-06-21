import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { Fragment } from "react";
import { BsTrash } from "react-icons/bs";
import { IconButton } from "../../IconButton";

interface Props {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onDelete: () => void;
  onDisprove: () => void;
}

export function HypothesisBarDeleteDialog({
  isOpen,
  onOpen,
  onClose,
  onDelete,
  onDisprove
}: Props) {
  return (
    <>
      <IconButton
        className="bg-transparent"
        onClick={onOpen}
        ovalProps={{
          stroke: "blue",
          height: "18px",
          width: "18px",
          fill: "transparent"
        }}
        icon={
          <BsTrash
            className="text-gray-600 border-0 border-l-1 border-gray-200"
            size={18}
          />
        }
      />

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    <div className="flex pointer-events-none sm:pointer-events-auto justify-between">
                      <span>Delete hypothesis? </span>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                        onClick={onClose}
                      >
                        <span className="sr-only">Close</span>
                        <XIcon
                          className="drop-shadow w-6 h-6"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Dialog.Title>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete the hypothesis or would
                      you rather mark this hypothesis as Disproven.
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
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
