import { ChevronDownIcon } from "@heroicons/react/solid";
import React, { useState } from "react";

type AccordionBoxProps = Omit<React.HTMLProps<HTMLDivElement>, "content"> & {
  content: React.ReactNode;
  hiddenContent?: React.ReactNode;
};

export function AccordionBox({
  content,
  hiddenContent,
  ...rest
}: AccordionBoxProps) {
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
        <div className="mt-1 flex justify-center">
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="flex items-center rounded-full border border-gray-300 bg-white px-2 py-1 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
