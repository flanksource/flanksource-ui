import React, { useState } from "react";

export function PopupTabs({
  tabs,
  contentStyle,
  contentClass,
  variant = "line",
  ...rest
}) {
  const [selected, setSelected] = useState(Object.keys(tabs)[0]);

  const buttonStyles = {
    line: {
      container: "flex space-x-4 border-b border-gray-300 z-10",
      button: "border-b-2 font-medium text-sm py-2 px-1",
      active: "border-indigo-500 text-indigo-600",
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
      <div style={contentStyle} className={contentClass}>
        {Object.entries(tabs).map(
          ([key, tab]) =>
            selected === key && (
              <div className={tab.class} key={key}>
                {tab.content}
              </div>
            )
        )}
      </div>
    </div>
  );
}
