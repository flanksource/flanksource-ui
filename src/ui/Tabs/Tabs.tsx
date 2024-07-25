import clsx from "clsx";
import React, { useMemo } from "react";

type TabItemProps = {
  label: string;
  value: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onSelectTab: () => void;
  activeTab: string;
};

function TabItem({
  label,
  value,
  onClick,
  onSelectTab,
  activeTab
}: TabItemProps) {
  return (
    <div
      key={label}
      onClick={(event) => {
        onClick?.(event);
        onSelectTab?.();
      }}
      className={clsx(
        value === activeTab
          ? "border-b-0 bg-white text-gray-900"
          : "border-0 border-b text-gray-500",
        "cursor-pointer rounded-t-md border border-gray-300 px-4 py-2 text-sm font-medium hover:text-gray-900"
      )}
    >
      {label}
    </div>
  );
}

type TabProps = {
  label: string;
  value: string;
} & React.HTMLProps<HTMLDivElement>;

export function Tab({ children, ...props }: TabProps) {
  return <div {...props}>{children}</div>;
}

type TabsProps<Tabs extends string> = React.HTMLProps<HTMLDivElement> & {
  children?: React.ReactElement<TabProps>[];
  activeTab: Tabs;
  onSelectTab: (label: Tabs) => void;
  contentClassName?: string;
};

export function Tabs<Tabs extends string = string>({
  activeTab,
  onSelectTab,
  children,
  className,
  contentClassName = "flex flex-col flex-1 overflow-y-auto bg-white border border-t-0 border-gray-300",
  ...rest
}: TabsProps<Tabs>) {
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
        onSelectTab: onSelectTabFn,
        props: child?.props,
        content: child
      };
    }) satisfies {
      label: string;
      value: string;
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
            onSelectTab={tab.onSelectTab}
            activeTab={activeTab}
            onClick={tab.props?.onClick!}
          />
        ))}
        {/* Add a phantom div to fill border */}
        <div className="flex-1 border-b border-gray-300" />
      </div>
      <div className={contentClassName}>{content}</div>
    </>
  );
}
