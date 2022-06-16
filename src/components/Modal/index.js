import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/solid";
import clsx from "clsx";
import "./index.css";

export function Modal({
  title,
  titleClass,
  footerClassName,
  actions,
  body,
  open,
  onClose,
  allowBackgroundClose,
  hideCloseButton,
  size,
  ...rest
}) {
  const { children } = { ...rest };
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
          className={clsx("flex items-center justify-center h-full", {
            "py-8": size === "full"
          })}
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
              className={clsx(
                "bg-white rounded-lg text-left shadow-xl transform transition-all w-full flex flex-col",
                `modal-card-${size}`
              )}
            >
              <div className="py-4 px-8 flex justify-between bg-gray-100">
                <h1 className={clsx("font-semibold text-lg", titleClass)}>
                  {title}
                </h1>
                {/* top-right close button */}
                {!hideCloseButton && (
                  <div className="pointer-events-none sm:pointer-events-auto">
                    <button
                      type="button"
                      className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                      onClick={onClose}
                    >
                      <span className="sr-only">Close</span>
                      <XIcon className="w-6 h-6" aria-hidden="true" />
                    </button>
                  </div>
                )}
              </div>

              <div className="px-8 overflow-y-auto modal-card__container">
                {children}
              </div>

              <div
                className={clsx("flex my-2 px-8 justify-end", footerClassName)}
              >
                {actions?.length && actions}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

Modal.propTypes = {
  title: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  titleClass: PropTypes.string,
  footerClassName: PropTypes.string,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  allowBackgroundClose: PropTypes.bool,
  hideCloseButton: PropTypes.bool,
  size: PropTypes.oneOf(["small", "medium", "full"])
};

Modal.defaultProps = {
  title: "",
  titleClass: "",
  footerClassName: "",
  allowBackgroundClose: true,
  hideCloseButton: false,
  size: "medium"
};
