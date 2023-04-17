import clsx from "clsx";
import { useEffect, useState } from "react";
import { IoChevronDownOutline, IoChevronUpOutline } from "react-icons/io5";
import { ClickableSvg } from "../ClickableSvg/ClickableSvg";

type Props = React.HTMLProps<HTMLDivElement> & {
  Header: React.ReactNode;
  children: React.ReactNode;
  isClosed?: boolean;
  childrenClassName?: string;
  dataCount?: number;
};

export default function CollapsiblePanel({
  Header,
  children,
  isClosed = false,
  className,
  childrenClassName = "transform origin-bottom duration-500",
  dataCount,
  ...props
}: Props) {
  const [isOpen, setIsOpen] = useState(!isClosed);

  useEffect(() => {
    if (dataCount === undefined) {
      return;
    }
    setIsOpen(dataCount > 0);
  }, [dataCount]);

  useEffect(() => {
    setIsOpen(!isClosed);
  }, [isClosed]);

  return (
    <div
      className={clsx("flex flex-col", className)}
      {...props}
      data-minimized={!isOpen}
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex flex-row py-2 cursor-pointer items-center justify-center h-12 ${
          isOpen ? "border-b border-dashed border-gray-200" : ""
        }`}
      >
        <div className="flex flex-row flex-1 items-center">{Header}</div>
        <div
          className="flex items-center justify-center space-y-0 inline-block"
          onClick={() => setIsOpen(!isOpen)}
        >
          <ClickableSvg>
            {isOpen ? (
              <IoChevronUpOutline className="w-6 h-6" />
            ) : (
              <IoChevronDownOutline className="w-6 h-6" />
            )}
          </ClickableSvg>
        </div>
      </div>
      <div
        className={`flex-1 flex-grow flex flex-col overflow-y-auto ${childrenClassName} ${
          isOpen ? "" : "hidden"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
