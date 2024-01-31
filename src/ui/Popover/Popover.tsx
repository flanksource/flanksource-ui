import clsx from "clsx";
import { LegacyRef, useCallback, useEffect } from "react";
import { FaCog } from "react-icons/fa";
import { useOnMouseActivity } from "../../hooks/useMouseActivity";
import { ClickableSvg } from "../ClickableSvg/ClickableSvg";

type PopoverProps = {
  popoverIcon?: React.ReactNode;
  children: React.ReactNode;
  placement?: "right" | "left";
  toggle?: React.ReactNode;
  autoCloseTimeInMS?: number;
  menuClass?: string;
} & React.HTMLProps<HTMLDivElement>;

export default function Popover({
  title,
  popoverIcon,
  children,
  placement = "right",
  className,
  menuClass = "top-6 w-56",
  toggle,
  autoCloseTimeInMS = 5000,
  ...props
}: PopoverProps) {
  const {
    isActive: isPopoverOpen,
    setIsActive: setIsPopoverOpen,
    ref: popoverRef
  } = useOnMouseActivity();

  const clickListener = useCallback(
    (event: MouseEvent) => {
      if (isPopoverOpen) {
        if (!popoverRef.current?.contains(event.target! as Node)) {
          setIsPopoverOpen(false);
        }
      }
    },
    [isPopoverOpen, popoverRef, setIsPopoverOpen]
  );

  const keydownListener = useCallback(
    (event: KeyboardEvent) => {
      if (event.code === "Escape") {
        setIsPopoverOpen(false);
      }
    },
    [setIsPopoverOpen]
  );

  useEffect(() => {
    if (!isPopoverOpen) {
      return;
    }
    setTimeout(() => {
      setIsPopoverOpen(false);
    }, autoCloseTimeInMS);
  }, [isPopoverOpen, autoCloseTimeInMS, setIsPopoverOpen]);

  useEffect(() => {
    document.removeEventListener("click", clickListener, {
      capture: true
    });
    document.addEventListener("click", clickListener, {
      capture: true
    });
    document.removeEventListener("keydown", keydownListener);
    document.addEventListener("keydown", keydownListener);
    return () => {
      document.removeEventListener("click", clickListener, {
        capture: true
      });
      document.removeEventListener("keydown", keydownListener);
    };
  }, [clickListener, keydownListener]);

  return (
    <div
      ref={popoverRef as LegacyRef<HTMLDivElement>}
      className={clsx("relative", className)}
      {...props}
      onClick={(e) => {
        e.stopPropagation();
        setIsPopoverOpen(true);
      }}
    >
      {!toggle && (
        <button className="content-center align-middle w-6 h-6 cursor-pointer md:mt-0">
          <ClickableSvg>
            {popoverIcon ? popoverIcon : <FaCog className="w-6 h-6" />}
          </ClickableSvg>
        </button>
      )}
      {toggle}
      <div
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        className={clsx(
          "flex flex-col origin-top-right absolute z-50 divide-y divide-gray-100 rounded-md drop-shadow-xl bg-slate-50 ring-1 ring-black ring-opacity-5 focus:outline-none",
          isPopoverOpen ? "display-block" : "hidden",
          placement === "right" ? "right-0" : "left-0",
          menuClass
        )}
      >
        {title && (
          <div className="flex flex-col py-1">
            <div className="flex items-center justify-between px-4 py-2 text-base">
              <span className="font-bold text-gray-700">{title}</span>
            </div>
          </div>
        )}
        <div className="flex flex-col">{children}</div>
      </div>
    </div>
  );
}
