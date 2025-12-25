import clsx from "clsx";
import React, { useMemo } from "react";

type TabItemProps = {
  label: string;
  value: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onSelectTab: () => void;
  activeTab: string;
  hoverable?: boolean;
  icon?: React.ReactNode;
  variant?: "light" | "dark";
};

function TabItem({
  label,
  value,
  onClick,
  onSelectTab,
  activeTab,
  icon,
  hoverable = true,
  variant = "light"
}: TabItemProps) {
  const isDark = variant === "dark";

  return (
    <div
      key={label}
      onClick={(event) => {
        onClick?.(event);
        onSelectTab?.();
      }}
      className={clsx(
        value === activeTab
          ? isDark
            ? "border-b-0 bg-black text-gray-100"
            : "border-b-0 bg-white text-gray-900"
          : isDark
            ? "border-0 border-b text-gray-400"
            : "border-0 border-b text-gray-500",
        "cursor-pointer rounded-t-md border px-4 py-2 text-sm font-bold",
        isDark ? "border-gray-600" : "border-gray-300",
        hoverable && (isDark ? "hover:text-gray-100" : "hover:text-gray-900")
      )}
    >
      {icon && <span className="mr-2 inline-block align-middle">{icon}</span>}
      <span className="inline-block align-middle">{label}</span>
    </div>
  );
}

type TabProps = {
  label: string;
  value: string;
  icon?: React.ReactNode;
} & React.HTMLProps<HTMLDivElement>;

export function Tab({ children, ...props }: TabProps) {
  return <div {...props}>{children}</div>;
}

type TabsProps<Tabs extends string> = React.HTMLProps<HTMLDivElement> & {
  children?: React.ReactElement<TabProps>[];
  activeTab: Tabs;
  onSelectTab: (label: Tabs) => void;
  contentClassName?: string;
  hoverable?: boolean;
  variant?: "light" | "dark";
};

export function Tabs<Tabs extends string = string>({
  activeTab,
  onSelectTab,
  children,
  className,
  contentClassName,
  hoverable = true,
  variant = "light",
  ...rest
}: TabsProps<Tabs>) {
  const isDark = variant === "dark";
  const defaultContentClassName = isDark
    ? "flex flex-col flex-1 overflow-y-auto bg-black border border-t-0 border-gray-600"
    : "flex flex-col flex-1 overflow-y-auto bg-white border border-t-0 border-gray-300";
  const resolvedContentClassName = contentClassName ?? defaultContentClassName;
  const tabs = useMemo(() => {
    if (!children) {
      return [];
    }
    return React.Children.map(children, (child) => {
      const label = child?.props?.label;
      const value = child?.props?.value;
      const onSelectTabFn = () => {
        onSelectTab?.(value as Tabs);
      };
      return {
        label,
        value,
        icon: child?.props?.icon,
        onSelectTab: onSelectTabFn,
        props: child?.props,
        content: child
      };
    }) satisfies {
      label: string;
      value: string;
      icon?: React.ReactNode;
      onSelectTab: () => void;
      props: TabProps;
      content: React.ReactElement<TabProps>;
    }[];
  }, [children, onSelectTab]);

  const content = useMemo(() => {
    return tabs?.find((tab) => tab.value === activeTab)?.content;
  }, [tabs, activeTab]);

  return (
    <>
      <div
        className={clsx(`flex h-auto flex-wrap`, className)}
        aria-label="Tabs"
        {...rest}
      >
        {tabs?.map((tab) => (
          <TabItem
            key={tab.label}
            label={tab.label!}
            value={tab.value!}
            icon={tab.icon}
            onSelectTab={tab.onSelectTab}
            activeTab={activeTab}
            onClick={tab.props?.onClick!}
            hoverable={hoverable}
            variant={variant}
          />
        ))}
        {/* Add a phantom div to fill border */}
        <div
          className={clsx(
            "flex-1 border-b",
            isDark ? "border-gray-600" : "border-gray-300"
          )}
        />
      </div>
      <div className={resolvedContentClassName}>{content}</div>
    </>
  );
}
