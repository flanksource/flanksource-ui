import { isCanaryUI } from "@flanksource-ui/context/Environment";
import clsx from "clsx";
import { useAtom } from "jotai";
import { useEffect, useRef } from "react";
import { isSidebarCollapsedAtom } from "../../../ui/Layout/SidebarLayout";

export type SidebarStickyProps = {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  isMenuItemOpen?: boolean;
  setMenuItemOpen?: (isOpen: boolean) => void;
};

export function CanaryStickySidebar({
  className,
  style,
  children,
  isMenuItemOpen = false,
  setMenuItemOpen = () => {},
  ...props
}: SidebarStickyProps) {
  const [isSidebarCollapsed] = useAtom(isSidebarCollapsedAtom);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        setMenuItemOpen(false);
      }
    }

    function keyPress(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenuItemOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", keyPress);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", keyPress);
    };
  }, [ref, setMenuItemOpen]);

  return (
    <div
      ref={ref}
      className={clsx(
        className ||
          "2xl:flex 2xl:flex-col h-full overflow-y-auto overflow-x-hidden w-80 border-r gap-4",
        // for mobile, float the sidebar on top of the content
        "fixed z-[99] 2xl:z-0 bg-white shadow-md 2xl:static 2xl:shadow-none 2xl:bg-transparent 2xl:border-none 2xl:w-auto 2xl:h-auto 2xl:overflow-y-auto 2xl:overflow-x-hidden 2xl:flex 2xl:flex-col 2xl:gap-4",
        // for mobile, hide the sidebar when the menu is closed
        isMenuItemOpen ? "flex" : "hidden",
        // move sidebar if mission control UI
        isCanaryUI
          ? "top-0 left-0"
          : isSidebarCollapsed
          ? "top-16 left-14"
          : "top-16 left-56"
      )}
      {...props}
    >
      <div
        className={`flex flex-col flex-1 overflow-y-auto w-full overflow-x-hidden gap-4 p-4 pb-20`}
      >
        {children}
      </div>
    </div>
  );
}
