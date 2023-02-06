import clsx from "clsx";
import React from "react";
import { useMemo } from "react";

function TabItem({
  label,
  value,
  onClick,
  onSelectTab,
  activeTab
}: {
  label: string;
  value: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onSelectTab: () => void;
  activeTab: string;
}) {
  return (
    <div
      key={label}
      onClick={(event) => {
        onClick?.(event);
        onSelectTab?.();
      }}
      style={{
        marginBottom: "-1px",
        borderColor: value === activeTab ? "" : "transparent",
        borderBottomColor: value === activeTab ? "white" : ""
      }}
      className={clsx(
        value === activeTab ? "text-gray-900 bg-white" : "text-gray-500",
        "cursor-pointer px-4 py-2 font-medium text-sm rounded-t-md border border-gray-300 hover:text-gray-900"
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

type TabsProps = React.HTMLProps<HTMLDivElement> & {
  children?: React.ReactElement<TabProps>[];
  activeTab: string;
  onSelectTab: (label: string) => void;
  contentClassName?: string;
};

export function Tabs({
  activeTab,
  onSelectTab,
  children,
  className,
  contentClassName = "bg-white border border-t-0 border-gray-300",
  ...rest
}: TabsProps) {
  const tabs = useMemo(() => {
    return React.Children.map(children, (child) => {
      const label = child?.props?.label;
      const value = child?.props?.value;
      const onSelectTabFn = () => {
        onSelectTab?.(value!);
      };
      return {
        label,
        value,
        onSelectTab: onSelectTabFn,
        props: child?.props,
        content: child
      };
    });
  }, [children, onSelectTab]);

  const content = useMemo(() => {
    return tabs?.find((tab) => tab.value === activeTab)?.content;
  }, [tabs, activeTab]);

  return (
    <>
      <div
        className={`flex flex-wrap border-b border-gray-300 ${className}`}
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
      </div>
      <div className={contentClassName}>{content}</div>
    </>
  );
}
