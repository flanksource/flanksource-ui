import { autoUpdate, useFloating } from "@floating-ui/react";
import { Popover as HLPopover } from "@headlessui/react";
import clsx from "clsx";
import { createPortal } from "react-dom";
import { FaCog } from "react-icons/fa";

type PopoverProps = {
  popoverIcon?: React.ReactNode;
  children: React.ReactNode;
  placement?: "right" | "left";
  toggle?: React.ReactNode;
  menuClass?: string;
  className?: string;
  title?: string;
};

export default function Popover({
  title,
  popoverIcon,
  children,
  placement = "right",
  className,
  menuClass = "top-6 w-56",
  toggle
}: PopoverProps) {
  const { refs, floatingStyles } = useFloating({
    whileElementsMounted: autoUpdate,
    placement: placement === "right" ? "bottom-end" : "bottom-start"
  });

  return (
    <HLPopover className={clsx("relative", className)}>
      <HLPopover.Button ref={refs.setReference}>
        {!toggle ? (
          popoverIcon ? (
            popoverIcon
          ) : (
            <FaCog className="h-6 w-6" />
          )
        ) : (
          toggle
        )}
      </HLPopover.Button>

      {/* Use portals to remove the Popover from normal flow of the HTML Elements which can be affected by things like overflow among others */}
      {createPortal(
        <HLPopover.Panel
          ref={refs.setFloating}
          className={clsx(
            "absolute z-50 flex origin-top-right flex-col divide-y divide-gray-100 rounded-md bg-slate-50 ring-1 ring-black ring-opacity-5 drop-shadow-xl focus:outline-none",
            menuClass
          )}
          style={floatingStyles}
        >
          {title && (
            <div className="flex flex-col py-1">
              <div className="flex items-center justify-between px-4 py-2 text-base">
                <span className="font-bold text-gray-700">{title}</span>
              </div>
            </div>
          )}
          <div className="flex flex-col">{children}</div>
        </HLPopover.Panel>,
        document.body
      )}
    </HLPopover>
  );
}
