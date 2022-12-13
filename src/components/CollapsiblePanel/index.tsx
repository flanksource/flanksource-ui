import { useState } from "react";
import { IoChevronDownOutline, IoChevronUpOutline } from "react-icons/io5";

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

  return (
    <div className="flex flex-col ">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex flex-row py-1 cursor-pointer items-center justify-center ${
          isOpen && "border-b border-dashed border-gray-200"
        }`}
      >
        <div className="flex flex-1">{Header}</div>
        <div
          className="flex flex-col items-center justify-center space-y-0"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <IoChevronUpOutline size={20} />
          ) : (
            <IoChevronDownOutline size={20} />
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
