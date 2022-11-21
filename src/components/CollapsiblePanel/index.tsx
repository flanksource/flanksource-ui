import { useEffect, useState } from "react";
import { IoChevronDownOutline, IoChevronUpOutline } from "react-icons/io5";
import ReactTooltip from "react-tooltip";

type Props = {
  Header: React.ReactNode;
  children: React.ReactNode;
  isClosed?: boolean;
};

export default function CollapsiblePanel({
  Header,
  children,
  isClosed = false
}: Props) {
  const [isOpen, setIsOpen] = useState(!isClosed);

  useEffect(() => {
    ReactTooltip.rebuild();
  });

  return (
    <div className="flex flex-col ">
      <div
        className={`flex flex-row py-1 cursor-pointer items-center justify-center ${
          isOpen && "border-b border-dashed border-gray-200"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-1">{Header}</div>
        <div className="flex flex-col items-center justify-center space-y-0">
          {isOpen ? (
            <IoChevronUpOutline data-tip="Close" size={20} />
          ) : (
            <IoChevronDownOutline data-tip="Open" size={20} />
          )}
        </div>
      </div>
      <div
        className={`flex flex-col transform origin-bottom duration-500 ${
          isOpen ? "" : "hidden"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
