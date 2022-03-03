import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/solid";
import React, { Fragment } from "react";

const sizeModal = {
  small: "small",
  medium: "medium",
  full: "full"
};

const listClasses = {
  small: {
    cardClass: "w-full overflow-y-auto",
    contentClass: "h-full px-8",
    cardStyle: {
      maxWidth: "420px",
      maxHeight: "calc(100vh - 4rem)",
      margin: "0 10px"
    },
    closeButtonClass: "w-6 h-6"
  },
  medium: {
    cardClass: "w-full overflow-y-auto",
    contentClass: "h-full px-8",
    cardStyle: {
      maxWidth: "1024px",
      maxHeight: "calc(100vh - 4rem)",
      margin: "0 15px"
    },
    closeButtonClass: "w-6 h-6"
  },
  full: {
    cardClass: "w-full overflow-y-auto",
    contentClass: "h-full px-8",
    cardStyle: {
      maxWidth: "1280px",
      maxHeight: "calc(100vh - 4rem)",
      margin: "0 20px"
    },
    closeButtonClass: "w-6 h-6",
    containerClass: "py-8"
  }
};

export function Modal({
  title,
  body,
  open,
  onClose,
  allowBackgroundClose = true,
  hideCloseButton,
  cancelText = "Close",
  hideActions,
  size = sizeModal.medium,
  ...rest
}) {
  const { children } = { ...rest };
  const {
    cardClass,
    contentClass,
    cardStyle,
    closeButtonClass,
    closeButtonStyle = {},
    containerClass = ""
  } = listClasses[size];
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        auto-reopen="true"
        className="fixed z-50 inset-0"
        onClose={allowBackgroundClose ? onClose : () => {}}
        {...rest}
      >
        <div
          className={`flex items-center justify-center h-full ${containerClass}`}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              style={cardStyle}
              className={`bg-white rounded-lg text-left shadow-xl transform transition-all ${cardClass}`}
            >
              <div className="mt-8 px-8 flex justify-between items-center ">
                <h1 className="font-semibold text-lg">{title}</h1>
                {/* top-right close button */}
                {!hideCloseButton && (
                  <div
                    className="pointer-events-none sm:pointer-events-auto"
                    style={closeButtonStyle}
                  >
                    <button
                      type="button"
                      className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                      onClick={onClose}
                    >
                      <span className="sr-only">Close</span>
                      <XIcon
                        className={`${closeButtonClass}`}
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                )}
              </div>
              <div
                className={contentClass}
                style={{ maxHeight: "80vh", overflowY: "auto" }}
              >
                {children}
              </div>
              <div style={{ minHeight: "1vh" }}>
                {!hideActions && (
                  <div className="flex justify-end mt-2">
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                      onClick={onClose}
                    >
                      {cancelText}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
