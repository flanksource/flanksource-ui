import clsx from "clsx";
import React, { useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";

type RoutedTabsLinksProps = React.HTMLProps<HTMLDivElement> & {
  children?: React.ReactNode;
  contentClassName?: string;
  containerClassName?: string;
  activeTabName?: string;
  tabLinks: {
    label: React.ReactNode;
    path: string;
    icon?: React.ReactNode;
    search?: string;
    key?: string;
  }[];
  // extraTabs renders custom controls (e.g. a dropdown tab) inline at the end
  // of the tab row, after the routed links.
  extraTabs?: React.ReactNode;
  // scrollable keeps the tab row on a single line and scrolls it horizontally
  // when the tabs overflow, instead of wrapping onto multiple lines.
  scrollable?: boolean;
};

export default function TabbedLinks({
  children,
  className,
  contentClassName = "bg-white border border-t-0 border-gray-300 flex-1 overflow-y-auto p-2",
  containerClassName = "px-4 py-6 bg-white",
  tabLinks,
  activeTabName,
  extraTabs,
  scrollable = false,
  ...rest
}: RoutedTabsLinksProps) {
  const tabsRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const tabKeys = tabLinks.map(({ key, path }) => key ?? path).join(",");

  // Keep the active tab in view when the row scrolls horizontally, so it never
  // hides past the overflow edge after navigation or when the tab set changes.
  useEffect(() => {
    if (!scrollable) {
      return;
    }
    const active = tabsRef.current?.querySelector('[aria-current="page"]');
    active?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [scrollable, activeTabName, pathname, tabKeys]);

  return (
    <div className={clsx("flex min-h-0 flex-1 flex-col", containerClassName)}>
      <div
        ref={tabsRef}
        className={clsx(
          "flex border-b border-gray-300",
          scrollable
            ? "flex-nowrap overflow-x-auto overflow-y-hidden"
            : "flex-wrap",
          className
        )}
        aria-label="Tabs"
        {...rest}
      >
        {tabLinks.map(({ label, path, key, search, icon }) => (
          <NavLink
            className={({ isActive }) =>
              clsx(
                "mb-[-2px] cursor-pointer rounded-t-md border border-b-0 border-gray-300 px-4 py-2 text-sm font-medium hover:text-gray-900",
                scrollable && "shrink-0 whitespace-nowrap",
                isActive || activeTabName === key
                  ? "bg-white text-gray-900"
                  : "border-transparent text-gray-500"
              )
            }
            key={path}
            to={{
              pathname: path,
              search
            }}
            end
          >
            <div className="flex flex-row items-center space-x-1">
              {icon} <span>{label}</span>
            </div>
          </NavLink>
        ))}
        {extraTabs}
      </div>
      <div className={clsx("flex flex-col", contentClassName)}>{children}</div>
    </div>
  );
}
