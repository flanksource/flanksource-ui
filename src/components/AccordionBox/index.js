import { ChevronDownIcon } from "@heroicons/react/solid";
import React, { useState } from "react";

function AccordionBoxFC({ content, hiddenContent, ...rest }) {
  const [show, setShow] = useState(false);

  return (
    <div {...rest}>
      {content}
      <div
        style={{
          transition: show
            ? "max-height 0.4s ease-in 0s"
            : "max-height 0.3s ease-out 0s",
          maxHeight: show ? "500px" : "0px"
        }}
        className="overflow-y-hidden"
      >
        {hiddenContent}
      </div>
      {hiddenContent && (
        <div className="flex justify-center mt-1">
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="flex items-center bg-white py-1 px-2 border border-gray-300 rounded-full shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <span className="mx-1">{show ? "Show less" : "Show more"}</span>
            <ChevronDownIcon
              className={`h-5 w-5 transform ${show && "rotate-180"}`}
            />
          </button>
        </div>
      )}
    </div>
  );
}

export const AccordionBox = React.memo(AccordionBoxFC);
