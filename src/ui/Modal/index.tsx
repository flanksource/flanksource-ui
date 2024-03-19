import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/solid";
import clsx from "clsx";
import { atom, useAtom } from "jotai";
import PropTypes from "prop-types";
import React, { Fragment } from "react";
import { IoMdHelp } from "react-icons/io";

/**
 *
 * An atom that can be used to set the help link for a modal. This is used to
 * display a help icon in the top right corner of the modal that links to the
 * documentation for the modal.
 *
 */
export const modalHelpLinkAtom = atom<string | undefined>(undefined);

export type ModalSize =
  | "small"
  | "slightly-small"
  | "medium"
  | "large"
  | "full";

const modalClassMap: { [k in ModalSize]: string } = {
  small: "max-w-md my-0 mx-2.5",
  "slightly-small": "max-w-prose my-0 mx-4",
  medium: "max-w-5xl my-0 mx-4",
  large: "max-w-5xl my-0 mx-5",
  full: "max-w-5xl my-0 mx-5"
};

const modalClassHeightMap: { [k in ModalSize]: string } = {
  small: "min-h-[30rem] h-auto",
  "slightly-small": "min-h-1/4 h-auto max-h-full",
  medium: "min-h-1/2 h-auto max-h-full",
  large: "min-h-3/4 h-auto max-h-full",
  full: "min-h-full h-auto max-h-full"
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

  /**
   *
   * If true, the modal will enforce the height of the modal to be the same as
   * the size. This is useful for modals that have a fixed height, such as
   * modals that contain a code editor.
   *
   */
  enforceSizeInHeight?: boolean;
  children: React.ReactNode;
  containerClassName?: string;
  dialogClassName?: string;
}

export function Modal({
  title,
  titleClass,
  bodyClass = "flex flex-col flex-1 overflow-y-auto",
  footerClassName,
  actions,
  open,
  onClose = () => {},
  allowBackgroundClose,
  hideCloseButton,
  size,
  enforceSizeInHeight = false,
  children,
  containerClassName = "overflow-auto max-h-full",
  dialogClassName = "fixed z-50 inset-0 overflow-y-auto min-h-2xl:my-20 py-4",
  ...rest
}: IModalProps) {
  const [helpLink] = useAtom(modalHelpLinkAtom);

  return (
    /* @ts-ignore */
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        auto-reopen="true"
        className={dialogClassName}
        onClose={allowBackgroundClose ? () => onClose() : () => {}}
        {...rest}
      >
        <div
          className={clsx("flex items-center justify-center h-full", {
            "py-8": size === "full"
          })}
        >
          {/* @ts-ignore */}
          <Transition.Child
            as={Fragment as any}
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
            as={Fragment as any}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              className={clsx(
                "bg-white rounded-lg text-left shadow-xl transform transition-all w-full  flex flex-col",
                containerClassName,
                modalClassMap[size],
                enforceSizeInHeight && modalClassHeightMap[size]
              )}
            >
              <div className="py-4 px-4 gap-2 flex item-center rounded-t-lg justify-between bg-gray-100">
                <h1
                  className={clsx(
                    "font-semibold flex-1 overflow-x-auto text-lg",
                    titleClass
                  )}
                >
                  {title}
                </h1>
                {/*
                If the modal has a help link, display a help icon in the top right
                corner of the modal that links to the documentation for the modal.
                */}
                {helpLink && (
                  <a
                    title="Link to documentation"
                    href={helpLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <IoMdHelp size={22} className="inline-block" />
                  </a>
                )}
                {/* top-right close button */}
                {!hideCloseButton && (
                  <div className="flex pointer-events-none sm:pointer-events-auto">
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                      onClick={() => onClose()}
                    >
                      <span className="sr-only">Close</span>
                      <XIcon
                        className="fill-gray-400 w-6 h-6"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                )}
              </div>

              <div className={bodyClass}>{children}</div>

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
