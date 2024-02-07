import { Transition } from "@headlessui/react";
import clsx from "clsx";
import { Fragment, useEffect, useState } from "react";
import { IoChevronUpOutline } from "react-icons/io5";
import { ClickableSvg } from "../ClickableSvg/ClickableSvg";

type Props = React.HTMLProps<HTMLDivElement> & {
  Header: React.ReactNode;
  children: React.ReactNode;
  isClosed?: boolean;
  childrenClassName?: string;
  dataCount?: number;
  isCollapsed?: boolean;
  onCollapsedStateChange?: (isClosed: boolean) => void;
};

export default function CollapsiblePanel({
  Header,
  children,
  isCollapsed = false,
  className,
  childrenClassName = "overflow-y-auto",
  dataCount,
  onCollapsedStateChange = () => {},
  ...props
}: Props) {
  const [isOpen, setIsOpen] = useState(!isCollapsed);

  useEffect(() => {
    setIsOpen(!isCollapsed);
  }, [isCollapsed]);

  return (
    <div
      className={clsx("flex flex-col h-auto space-y-2", className)}
      {...props}
      data-minimized={isCollapsed}
    >
      <div
        role="button"
        onClick={() => {
          setIsOpen(!isOpen);
          onCollapsedStateChange(!isOpen);
        }}
        className={`flex flex-row py-2 cursor-pointer items-center justify-center h-12 bg-gray-50 rounded-md px-2 shadow-sm`}
      >
        <div className="flex flex-row flex-1 items-center">{Header}</div>
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
            <IoChevronUpOutline className="w-6 h-6" />
          </ClickableSvg>
        </div>
      </div>

      {/* @ts-ignore */}
      <Transition
        as={Fragment as any}
        className={`flex-1 max-h-full flex flex-col ${childrenClassName}`}
        show={isOpen}
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-75"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className={`flex-1  flex flex-col max-h-full `}>{children}</div>
      </Transition>
    </div>
  );
}
