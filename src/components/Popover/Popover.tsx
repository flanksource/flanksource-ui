import clsx from "clsx";
import { LegacyRef } from "react";
import { FaCog } from "react-icons/fa";
import { useOnMouseActivity } from "../../hooks/useMouseActivity";

type PopoverProps = {
  title?: string;
  popoverIcon?: React.ReactNode;
  children: React.ReactNode;
  placement?: "right" | "left";
};

export default function Popover({
  title,
  popoverIcon,
  children,
  placement = "right",
  ...props
}: PopoverProps) {
  const {
    isActive: isPopoverOpen,
    setIsActive: setIsPopoverOpen,
    ref: popoverRef
  } = useOnMouseActivity();

  return (
    <div
      ref={popoverRef as LegacyRef<HTMLDivElement>}
      className={`relative p-2`}
      {...props}
    >
      <button
        className="content-center align-middle w-6 h-6 cursor-pointer md:mt-0"
        onClick={() => setIsPopoverOpen((isToggled) => !isToggled)}
      >
        {popoverIcon ? popoverIcon : <FaCog className="" />}
      </button>
      <div
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        className={clsx(
          "flex flex-col origin-top-right absolute mt-5 w-96 z-50 divide-y divide-gray-100 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none capitalize",
          isPopoverOpen ? "display-block" : "hidden",
          placement === "right" ? "right-0" : "left-0"
        )}
      >
        {title && (
          <div className="flex flex-col py-1">
            <div className="flex items-center justify-between px-4 py-2 text-base">
              <span className="font-bold text-gray-700">{title}</span>
            </div>
          </div>
        )}
        <div className="flex flex-col px-4 py-2">{children}</div>
      </div>
    </div>
  );
}
