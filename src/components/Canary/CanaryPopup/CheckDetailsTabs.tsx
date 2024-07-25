import React, { LegacyRef, useLayoutEffect, useRef, useState } from "react";
import { classNames } from "../utils";

type PopupTabsProps = React.HTMLProps<HTMLDivElement> & {
  tabs: Record<
    string,
    {
      label: string | React.ReactNode;
      hidden?: boolean;
      content: React.ReactNode;
      class?: string;
    }
  >;
  contentStyle?: React.CSSProperties;
  shareHeight?: boolean;
  contentClassName?: string;
  variant?: string;
};

const buttonStyles = {
  line: {
    container: "flex space-x-4 ",
    button: "border-b-2 font-medium text-sm py-2 px-1",
    active: "border-blue-500 text-blue-600",
    inactive:
      "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
    styles: {} as Record<string, any>
  },
  simple: {
    container: "flex flex-wrap  z-10",
    button:
      "-mb-px z-10 bg-white px-4 py-2 font-medium text-sm rounded-t-md border-gray-300 hover:text-gray-900",
    active: "text-gray-900 border",
    inactive: "text-gray-500 border-b",
    styles: {
      active: {
        borderBottomColor: "white"
      }
    } as Record<string, any>
  }
} as const;

export function CheckDetailsTabs({
  tabs,
  contentStyle,
  shareHeight = false, // all tab content height would be determined by the tab with the tallest content
  contentClassName,
  variant = "line",
  ...rest
}: PopupTabsProps) {
  const [sharedHeight, setSharedHeight] = useState(0);
  const [selected, setSelected] = useState(Object.keys(tabs)[0]);

  // Get shared tabContent height from the tallest tab element.
  const sharedHeightRef = useRef<HTMLDivElement>();
  useLayoutEffect(() => {
    if (
      sharedHeightRef.current &&
      sharedHeightRef.current.children?.length > 0
    ) {
      requestAnimationFrame(() => {
        let maxHeight = 0;
        Array.from(sharedHeightRef.current?.children || []).forEach((o) => {
          maxHeight = Math.max(o.clientHeight, maxHeight);
        });
        setSharedHeight(maxHeight);
      });
    }
  }, [sharedHeightRef]);

  return (
    <div {...rest}>
      <div
        className={`${
          buttonStyles[variant as keyof typeof buttonStyles].container
        } pb-2`}
        aria-label="Tabs"
      >
        {Object.entries(tabs).map(([key, tab]) => (
          <button
            type="button"
            key={key}
            hidden={tab.hidden}
            onClick={() => setSelected(key)}
            className={`${
              buttonStyles[variant as keyof typeof buttonStyles].button
            } ${
              selected === key
                ? buttonStyles[variant as keyof typeof buttonStyles].active
                : buttonStyles[variant as keyof typeof buttonStyles].inactive
            }`}
            style={{
              ...buttonStyles[variant as keyof typeof buttonStyles]?.styles
                ?.button,
              ...(selected === key
                ? buttonStyles[variant as keyof typeof buttonStyles]?.styles
                    ?.active
                : buttonStyles[variant as keyof typeof buttonStyles]?.styles
                    ?.inactive)
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        style={contentStyle}
        className={classNames(
          contentClassName,
          shareHeight && `relative ${sharedHeight}`
        )}
      >
        {Object.entries(tabs).map(
          ([key, tab]) =>
            selected === key && (
              <div
                className={classNames(tab.class)}
                style={{
                  height: shareHeight ? `${sharedHeight + 2}px` : undefined
                }}
                key={key}
              >
                {tab.content}
              </div>
            )
        )}
        {shareHeight && (
          <div
            className="invisible absolute"
            ref={sharedHeightRef as LegacyRef<HTMLDivElement>}
          >
            {Object.entries(tabs).map(([key, tab]) => (
              <div className={classNames(tab.class)} key={key}>
                {tab.content}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
