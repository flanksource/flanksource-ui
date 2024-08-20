import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { XIcon } from "@heroicons/react/solid";
import clsx from "clsx";
import { atom, useAtom } from "jotai";
import React, { useState } from "react";
import { BsArrowsFullscreen, BsFullscreenExit } from "react-icons/bs";
import { useWindowSize } from "react-use-size";
import DialogButton from "../Buttons/DialogButton";
import HelpLink from "../Buttons/HelpLink";

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
  /**
   *
   * Path to the documentation for the modal, relative to the base URL.
   *
   * The base is set to `https://docs.flanksource.com/`.
   *
   */
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
  helpLink: helpLinkProps,
  ...rest
}: IModalProps) {
  const [_helpLink, setHelpLink] = useAtom(modalHelpLinkAtom);
  const [_size, setSize] = useState(size);
  const sizeClass = useDialogSize(_size);
  const isSmall = _size === "very-small" || _size === "small";

  const helpLink = _helpLink || helpLinkProps;

  return (
    <Dialog
      as="div"
      open={open}
      auto-reopen="true"
      className={dialogClassName}
      onClose={() => {
        // reset the help link when the modal is closed, this is to ensure
        // that the help link is not displayed when the modal is reopened and
        // the help link is not set.
        setHelpLink(undefined);

        if (allowBackgroundClose) {
          onClose();
        }
      }}
      {...rest}
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/30 duration-300 ease-out data-[closed]:opacity-0"
      />
      <DialogPanel
        transition
        className={clsx(
          "flex items-center justify-center",
          sizeClass.classNames,
          sizeClass.width
        )}
      >
        <div
          className={clsx(
            !isSmall && "mb-10 mt-10 justify-between overflow-auto",
            !isSmall && childClassName,
            "flex transform flex-col rounded-lg bg-white text-left shadow-xl transition-all",
            isSmall && "mx-4 my-0 w-full max-w-prose",
            sizeClass.height
          )}
        >
          <div className="item-center flex justify-between gap-2 rounded-t-lg bg-gray-100 px-4 py-4">
            <h1
              className={clsx(
                "flex-1 overflow-x-auto text-lg font-semibold",
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
              <DialogButton icon={XIcon} onClick={onClose} name="close" />
            )}
          </div>

          <div
            className={clsx(
              !isSmall && "mb-auto flex flex-1 flex-col",
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
      </DialogPanel>
    </Dialog>
  );
}
