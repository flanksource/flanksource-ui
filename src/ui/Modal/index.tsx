import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/solid";
import clsx from "clsx";
import { atom, useAtom } from "jotai";
import React, { Fragment, useState } from "react";
import HelpLink from "../Buttons/HelpLink";
import { BsArrowsFullscreen, BsFullscreenExit } from "react-icons/bs";
import { useWindowSize } from "react-use-size";
import DialogButton from "../Buttons/DialogButton";

/**
 *
 * An atom that can be used to set the help link for a modal. This is used to
 * display a help icon in the top right corner of the modal that links to the
 * documentation for the modal.
 *
 */
export const modalHelpLinkAtom = atom<string | undefined>(undefined);
export type ModalSize = "very-small" | "small" | "medium" | "large" | "full";

const HEADER_HEIGHT = 60;
export interface IModalProps {
  title?: React.ReactNode;
  showExpand?: boolean;
  titleClass?: string;
  helpLink?: string;
  bodyClass?: string;
  childClassName?: string;
  footerClassName?: string;
  actions?: React.ReactNode[];
  open: boolean;
  onClose?: (e?: MouseEvent) => void;
  allowBackgroundClose?: boolean;
  hideCloseButton?: boolean;
  size?: ModalSize;
  children?: React.ReactNode;
  containerClassName?: string;
  dialogClassName?: string;
}

export function useDialogSize(size?: string): {
  windowHeight: number;
  windowWidth: number;
  height: string;
  width: string;
  classNames: string;
} {
  const { height, width } = useWindowSize();
  let ret = {
    classNames: "",
    windowHeight: height,
    windowWidth: width,
    height: "",
    width: ""
  };

  if (size === "very-small" || size === "small") {
    ret.height = " h-full";
  } else {
    ret.classNames += " mx-auto my-auto";
  }

  if (size === "small") {
    ret.classNames += " max-w-[800px] max-h-[50vh]";
  }

  if (size === "full") {
    if (width >= 1600) {
      ret.width = " w-[1500px]";
    } else if (width >= 1280) {
      ret.width = " w-[1200px]";
    } else if (width >= 1024) {
      ret.width = " w-[1000px]";
    } else if (width >= 768) {
      ret.width = " w-[90vw]";
    } else if (width < 768) {
      ret.width = " w-[95vw]";
    }
    ret.height = " h-[90vh]";
  }

  if (size === "medium" || size === undefined) {
    if (width >= 1280) {
      ret.width = " w-[1000px]";
    } else if (width >= 1024) {
      ret.width = " w-[850px]";
    } else if (width >= 768) {
      ret.width = " w-[500vw]";
    } else if (width < 768) {
      ret.width = " w-[95vw]";
    }
    if (height < 1000) {
      ret.height = ` max-h-[${height - HEADER_HEIGHT * 2}px]`;
    } else if (height > 1000) {
      ret.height = " max-h-[80vh]";
    }
  }

  if (size === "large") {
    if (width >= 1280) {
      ret.width = " w-[1240px]";
    } else if (width >= 1024) {
      ret.width = " w-[1000px]";
    } else if (width >= 768) {
      ret.width = " w-[600px]";
    } else if (width < 768) {
      ret.width = " w-[95vw]";
    }
    if (height < 1000) {
      ret.height = ` max-h-[${height - HEADER_HEIGHT * 2}px]`;
    } else if (height > 1000) {
      ret.height = " max-h-[90vh]";
    }
  }

  return ret;
}

export function Modal({
  title,
  showExpand = true,
  titleClass,
  bodyClass = "flex flex-col flex-1 overflow-y-auto",
  footerClassName = "flex my-2 px-8 justify-end",
  actions,
  open,
  onClose = () => {},
  childClassName = "w-full",
  allowBackgroundClose = true,
  hideCloseButton,
  size = "medium",
  children,
  containerClassName = "overflow-auto max-h-full",
  dialogClassName = "fixed z-50 inset-0 overflow-y-auto min-h-2xl:my-20 py-4",
  ...rest
}: IModalProps) {
  const [helpLink] = useAtom(modalHelpLinkAtom);
  const [_size, setSize] = useState(size);
  const sizeClass = useDialogSize(_size);
  const isSmall = _size === "very-small" || _size === "small";

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
          className={clsx(
            "flex items-center justify-center",
            sizeClass.classNames,
            sizeClass.width
          )}
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
                !isSmall && "justify-between overflow-auto mt-10 mb-10",
                !isSmall && childClassName,
                "bg-white rounded-lg text-left shadow-xl transform transition-all flex flex-col",
                isSmall && "w-full max-w-prose my-0 mx-4",
                sizeClass.height
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
                {helpLink && <HelpLink link={helpLink} />}
                {showExpand && _size !== "full" && !isSmall && (
                  <DialogButton
                    icon={BsArrowsFullscreen}
                    onClick={() => {
                      setSize("full");
                    }}
                  />
                )}

                {showExpand && _size === "full" && (
                  <DialogButton
                    icon={BsFullscreenExit}
                    onClick={() => setSize(size)}
                  />
                )}

                {/* top-right close button */}
                {!hideCloseButton && (
                  <DialogButton icon={XIcon} onClick={onClose} />
                )}
              </div>

              <div
                className={clsx(
                  !isSmall && "flex flex-col flex-1 mb-auto ",
                  bodyClass,
                  `max-h-[${sizeClass.windowHeight - 50}px]`
                )}
              >
                {children}
              </div>

              {Boolean(actions?.length) && (
                <div className={clsx(footerClassName)}>
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
