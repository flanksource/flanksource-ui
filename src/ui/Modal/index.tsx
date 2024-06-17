import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/solid";
import clsx from "clsx";
import { atom, useAtom } from "jotai";
import React, { Fragment, createContext, useContext, useMemo, useState } from "react";
import HelpLink from "../Buttons/HelpLink";
import { BsArrowsFullscreen, BsFullscreenExit } from "react-icons/bs";
import { useWindowSize } from "react-use-size";
import DialogButton from "../Buttons/DialogButton";

export type ModalContextProps = {
  props: IModalProps;
  setProps: (props: IModalProps) => void;
}

export function useModal() {
  return useContext(ModalContext)
}

export const ModalContext = createContext<ModalContextProps>(undefined!);

/**
 *
 * An atom that can be used to set the help link for a modal. This is used to
 * display a help icon in the top right corner of the modal that links to the
 * documentation for the modal.
 *
 */
export const modalHelpLinkAtom = atom<string | undefined>(undefined);
export type ModalSize = "small" | "medium" | "large" | "full";

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

export function useDialogSize(size?: string) {
  const { height, width } = useWindowSize();
  return useMemo(() => clsx(
    size === 'full' && {
      'min-w-[1240px] w-[1240px]': width >= 1280,
      'w-[1000px]': width < 1280 && width >= 1024,
      'w-[90vw]': width < 1024 && width >= 768,
      'w-[95vw]': width < 768,
      'h-[90vh]': height < 1000,
      'h-[1000px]': height > 1000,
    },
    size === 'small' && 'max-w-[800px] max-h-[50vh]',
    size === 'medium' && {
      'w-[1000px]': width >= 1280,
      'w-[850px]': width < 1280 && width >= 1024,
      'w-[500vw]': width < 1024 && width >= 768,
      'w-[95vw]': width < 768,
      'h-[70vh]': height < 1000,
      'h-[800px]': height > 1000,
    },
    size === 'large' && {
      'min-w-[1240px] w-[1240px]': width >= 1280,
      'w-[1000px]': width < 1280 && width >= 1024,
      'w-[600px]': width < 1024 && width >= 768,
      'w-[95vw]': width < 768,
      'h-[80vh]': height < 1000,
      'h-[1000px]': height > 1000,

    },
  ), [height, width, size]);
}

export function Modal({
  title,
  showExpand = true,
  titleClass,
  bodyClass = "flex flex-col flex-1 overflow-y-auto",
  footerClassName = "flex my-2 px-8 justify-end",
  actions,
  open,
  onClose = () => { },
  childClassName,
  allowBackgroundClose,
  hideCloseButton,
  size,
  children,
  containerClassName = "overflow-auto max-h-full",
  dialogClassName = "fixed z-50 inset-0 overflow-y-auto min-h-2xl:my-20 py-4",
  ...rest
}: IModalProps) {
  const [helpLink] = useAtom(modalHelpLinkAtom);
  const [_size, setSize] = useState(size);
  const sizeClass = useDialogSize(size);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        auto-reopen="true"
        className={dialogClassName}
        onClose={allowBackgroundClose ? () => onClose() : () => { }}
        {...rest}
      >
        <div
          className={clsx("flex items-center justify-center mx-auto my-auto", sizeClass)}        >
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
            <div className={clsx(
              _size !== "small" && childClassName,
              "mt-20 mb-10 justify-between overflow-auto  bg-white rounded-lg text-left shadow-xl transform transition-all  flex flex-col")}
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
                {showExpand && _size !== 'full' && size !== 'small' &&
                  <DialogButton icon={BsArrowsFullscreen} onClick={() => setSize('full')} />}


                {showExpand && _size === 'full' && <DialogButton icon={BsFullscreenExit} onClick={() => setSize('medium')} />}



                {/* top-right close button */}
                {!hideCloseButton && <DialogButton icon={XIcon} onClick={onClose} />}
              </div>

              <div className={clsx("flex flex-col flex-1 mb-auto ", bodyClass)} >
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
