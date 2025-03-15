import { Transition } from "@headlessui/react";
import clsx from "clsx";
import { Fragment, useEffect, useState } from "react";
import { IoChevronUpOutline } from "react-icons/io5";
import { ClickableSvg } from "../ClickableSvg/ClickableSvg";

type Props = React.HTMLProps<HTMLDivElement> & {
  Header: React.ReactNode;
  children: React.ReactNode;
  childrenClassName?: string;
  dataCount?: number;
  isCollapsed?: boolean;
  onCollapsedStateChange?: (isClosed: boolean) => void;
  iconClassName?: string;
};

export default function CollapsiblePanel({
  Header,
  children,
  isCollapsed = false,
  className,
  childrenClassName = "overflow-y-auto",
  dataCount,
  onCollapsedStateChange = () => {},
  iconClassName = "h-6 w-6",
  ...props
}: Props) {
  const [isOpen, setIsOpen] = useState(!isCollapsed);

  useEffect(() => {
    setIsOpen(!isCollapsed);
  }, [isCollapsed]);

  return (
    <div
      className={clsx("flex h-auto flex-col gap-2 py-1", className)}
      {...props}
      data-minimized={isCollapsed}
    >
      <div
        role="button"
        onClick={() => {
          setIsOpen(!isOpen);
          onCollapsedStateChange(!isOpen);
        }}
        className={`flex h-12 cursor-pointer flex-row items-center justify-center rounded-md bg-gray-50 px-2 py-2 shadow-sm`}
      >
        <div className="flex flex-1 flex-row items-center">{Header}</div>
        <div
          className="flex items-center justify-center space-y-0"
          onClick={() => {
            setIsOpen(!isOpen);
            onCollapsedStateChange(!isOpen);
          }}
        >
          <ClickableSvg
            className={clsx("transform duration-1000", {
              "rotate-180": !isOpen
            })}
          >
            <IoChevronUpOutline className={iconClassName} />
          </ClickableSvg>
        </div>
      </div>

      {/* @ts-ignore */}
      <Transition
        as={Fragment as any}
        className={`flex max-h-full flex-1 flex-col ${childrenClassName}`}
        show={isOpen}
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-75"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className={`flex max-h-full flex-1 flex-col`}>{children}</div>
      </Transition>
    </div>
  );
}
