import React, { useState } from "react";
import { BiChevronLeft } from "react-icons/bi";

export function SidebarSubPanel({ subpanelContent, icon, ...rest }) {
  const { children } = rest;
  const [showSubpanel, setShowSubpanel] = useState(false);

  const toggleSubpanel = () => {
    setShowSubpanel(!showSubpanel);
  };

  return (
    <div>
      <div className="mb-4 h-8 flex items-center justify-end">
        <button
          className="h-7  flex items-center justify-center"
          type="button"
          onClick={toggleSubpanel}
        >
          {showSubpanel ? (
            <>
              <BiChevronLeft
                title="Go back"
                className="text-gray-600 h-6 w-6"
              />
              <span className="uppercase font-semibold text-sm text-gray-600 ml-1">
                Back
              </span>
            </>
          ) : (
            icon
          )}
        </button>
      </div>
      {showSubpanel ? subpanelContent : children}
    </div>
  );
}
