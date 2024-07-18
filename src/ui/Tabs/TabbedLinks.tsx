import clsx from "clsx";
import React from "react";
import { NavLink } from "react-router-dom";

type RoutedTabsLinksProps = React.HTMLProps<HTMLDivElement> & {
  children?: React.ReactNode;
  contentClassName?: string;
  containerClassName?: string;
  activeTabName?: string;
  tabLinks: {
    label: React.ReactNode;
    path: string;
    search?: string;
    key?: string;
  }[];
};

export default function TabbedLinks({
  children,
  className,
  contentClassName = "bg-white border border-t-0 border-gray-300 flex-1 overflow-y-auto p-2",
  containerClassName = "px-4 py-6 bg-gray-100",
  tabLinks,
  activeTabName,
  ...rest
}: RoutedTabsLinksProps) {
  return (
    <div
      className={clsx(
        "flex flex-1 flex-col overflow-y-auto",
        containerClassName
      )}
    >
      <div
        className={`flex flex-wrap border-b border-gray-300 ${className}`}
        aria-label="Tabs"
        {...rest}
      >
        {tabLinks.map(({ label, path, key, search }) => (
          <NavLink
            className={({ isActive }) =>
              clsx(
                "mb-[-2px] cursor-pointer rounded-t-md border border-b-0 border-gray-300 px-4 py-2 text-sm font-medium hover:text-gray-900",
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
            {label}
          </NavLink>
        ))}
      </div>
      <div className={contentClassName}>{children}</div>
    </div>
  );
}
