import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/solid";
import clsx from "clsx";

type ModalSize = "small" | "slightly-small" | "medium" | "large" | "full";

const modalClassMap: { [k in ModalSize]: string } = {
  small: "max-w-md my-0 mx-2.5",
  "slightly-small": "max-w-prose my-0 mx-4",
  medium: "max-w-5xl my-0 mx-4",
  large: "max-w-5xl my-0 mx-5",
  full: "max-w-5xl my-0 mx-5"
};

interface IModalProps {
  title: React.ReactNode;
  titleClass: string;
  bodyClass?: string;
  footerClassName: string;
  actions?: React.ReactNode[];
  open: boolean;
  onClose: (e?: MouseEvent) => void;
  allowBackgroundClose: boolean;
  hideCloseButton: boolean;
  size: ModalSize;
  children: React.ReactNode;
}

export function Modal({
  title,
  titleClass,
  bodyClass,
  footerClassName,
  actions,
  open,
  onClose = () => {},
  allowBackgroundClose,
  hideCloseButton,
  size,
  ...rest
}: IModalProps) {
  const { children } = { ...rest };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        auto-reopen="true"
        className="fixed z-50 inset-0 overflow-y-auto"
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
                modalClassMap[size]
              )}
            >
              <div className="py-4 px-4 flex item-center rounded-t-lg justify-between bg-gray-100">
                <h1 className={clsx("font-semibold text-lg", titleClass)}>
                  {title}
                </h1>
                {/* top-right close button */}
                {!hideCloseButton && (
                  <div className="flex pointer-events-none sm:pointer-events-auto">
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
                )}
              </div>

              <div className={bodyClass ?? "px-8"}>{children}</div>

              {Boolean(actions?.length) && (
                <div
                  className={clsx(
                    "flex my-2 px-8 justify-end",
                    footerClassName
                  )}
                >
                  {actions?.length && actions}
                </div>
              )}
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
  size: PropTypes.oneOf(["small", "medium", "full", "slightly-small"])
};

Modal.defaultProps = {
  title: "",
  titleClass: "",
  footerClassName: "",
  allowBackgroundClose: true,
  hideCloseButton: false,
  size: "medium"
};
