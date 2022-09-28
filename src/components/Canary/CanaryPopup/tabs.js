import React, { useLayoutEffect, useRef, useState } from "react";
import { classNames } from "../utils";

export function PopupTabs({
  tabs,
  contentStyle,
  shareHeight = false, // all tab content height would be determined by the tab with the tallest content
  contentClass,
  variant = "line",
  ...rest
}) {
  const [sharedHeight, setSharedHeight] = useState(0);
  const [selected, setSelected] = useState(Object.keys(tabs)[0]);

  const buttonStyles = {
    line: {
      container: "flex space-x-4 border-b border-gray-300 z-5",
      button: "border-b-2 font-medium text-sm py-2 px-1",
      active: "border-blue-500 text-blue-600",
      inactive:
        "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
    },
    simple: {
      container: "flex flex-wrap border-b border-gray-300 z-10",
      button:
        "-mb-px z-10 bg-white px-4 py-2 font-medium text-sm rounded-t-md border-gray-300 hover:text-gray-900",
      active: "text-gray-900 border",
      inactive: "text-gray-500 border-b",
      styles: {
        active: {
          borderBottomColor: "white"
        }
      }
    }
  };

  // Get shared tabContent height from the tallest tab element.
  const sharedHeightRef = useRef();
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
      <div className={buttonStyles[variant].container} aria-label="Tabs">
        {Object.entries(tabs).map(([key, tab]) => (
          <button
            type="button"
            key={key}
            onClick={() => setSelected(key)}
            className={`${buttonStyles[variant].button} ${
              selected === key
                ? buttonStyles[variant].active
                : buttonStyles[variant].inactive
            }`}
            style={{
              ...buttonStyles[variant]?.styles?.button,
              ...(selected === key
                ? buttonStyles[variant]?.styles?.active
                : buttonStyles[variant]?.styles?.inactive)
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        style={contentStyle}
        className={classNames(
          contentClass,
          shareHeight && `relative ${sharedHeight}`
        )}
      >
        {Object.entries(tabs).map(
          ([key, tab]) =>
            selected === key && (
              <div
                className={classNames(tab.class)}
                style={{
                  height: shareHeight ? `${sharedHeight + 2}px` : null
                }}
                key={key}
              >
                {tab.content}
              </div>
            )
        )}
        {shareHeight && (
          <div className="absolute invisible" ref={sharedHeightRef}>
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
