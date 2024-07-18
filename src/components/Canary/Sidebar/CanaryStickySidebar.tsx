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
          "h-full w-80 gap-4 overflow-y-auto overflow-x-hidden border-r 2xl:flex 2xl:flex-col",
        // for mobile, float the sidebar on top of the content
        "fixed z-[99] bg-white shadow-md 2xl:static 2xl:z-0 2xl:flex 2xl:h-auto 2xl:w-auto 2xl:flex-col 2xl:gap-4 2xl:overflow-y-auto 2xl:overflow-x-hidden 2xl:border-none 2xl:bg-transparent 2xl:shadow-none",
        // for mobile, hide the sidebar when the menu is closed
        isMenuItemOpen ? "flex" : "hidden",
        // move sidebar if mission control UI
        isCanaryUI
          ? "left-0 top-0"
          : isSidebarCollapsed
            ? "left-14 top-16"
            : "left-56 top-16"
      )}
      {...props}
    >
      <div
        className={`flex w-full flex-1 flex-col gap-4 overflow-y-auto overflow-x-hidden p-4 pb-20`}
      >
        {children}
      </div>
    </div>
  );
}
