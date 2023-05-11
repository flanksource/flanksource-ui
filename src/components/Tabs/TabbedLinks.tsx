import clsx from "clsx";
import React from "react";
import { NavLink } from "react-router-dom";

type RoutedTabsLinksProps = React.HTMLProps<HTMLDivElement> & {
  children?: React.ReactNode;
  contentClassName?: string;
  containerClassName?: string;
  tabLinks: {
    label: React.ReactNode;
    path: string;
  }[];
};

export default function TabbedLinks({
  children,
  className,
  contentClassName = "bg-white border border-t-0 border-gray-300 flex-1 overflow-y-auto p-2",
  containerClassName = "px-4 py-6 bg-gray-100",
  tabLinks,
  ...rest
}: RoutedTabsLinksProps) {
  return (
    <div
      className={clsx(
        "flex flex-col overflow-y-auto flex-1",
        containerClassName
      )}
    >
      <div
        className={`flex flex-wrap border-b border-gray-300 ${className}`}
        aria-label="Tabs"
        {...rest}
      >
        {tabLinks.map(({ label, path }) => (
          <NavLink
            className={({ isActive }) =>
              clsx(
                "cursor-pointer px-4 py-2 font-medium text-sm rounded-t-md border border-b-0 border-gray-300 hover:text-gray-900 mb-[-2px]",
                isActive
                  ? "text-gray-900 bg-white"
                  : "text-gray-500 border-transparent"
              )
            }
            key={path}
            to={path}
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
