import React, { useState } from "react";
import { BsArrowReturnLeft } from "react-icons/bs";

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
              <span className="uppercase font-semibold text-sm text-gray-600 mr-2">
                Back
              </span>
              <BsArrowReturnLeft
                title="Go back"
                className="text-gray-600 h-6 w-6"
              />
            </>
          ) : (
            icon
          )}
        </button>
      </div>
      {showSubpanel ? <>{subpanelContent}</> : <>{children}</>}
    </div>
  );
}
