import { CheckIcon } from "@heroicons/react/solid";
import React, { useState } from "react";

export function EvidenceBuilder({ ...rest }) {
  const [currentStep, setCurrentStep] = useState(0);
  return (
    <div className={`py-8 ${rest.className || ""}`} {...rest}>
      <div className="text-xl font-medium text-gray-800 mb-4">Add Evidence</div>
      <EvidenceStepper currentStep={currentStep} />
      <div className="">
        <div className="h-56" />

        <div>
          <button
            type="button"
            onClick={() => setCurrentStep(Math.max(currentStep - 1, 0))}
            className="inline-flex items-center px-2.5 py-1.5 mb-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            prev
          </button>
          <button
            type="button"
            onClick={() => setCurrentStep(Math.min(currentStep + 1, 2))}
            className="inline-flex items-center px-2.5 py-1.5 mb-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            next
          </button>
        </div>
      </div>
    </div>
  );
}

export function EvidenceStepper({ currentStep, ...rest }) {
  const evidenceSteps = {
    0: {
      title: "Evidence type",
      description: "Lorem ipsum dolor sit amet"
    },
    1: {
      title: "Search",
      description: "Lorem ipsum dolor sit amet"
    },
    2: {
      title: "Select",
      description: "Lorem ipsum dolor sit amet"
    }
  };
  return (
    <div className={`flex flex-row border ${rest.className}`} {...rest}>
      {Object.entries(evidenceSteps).map(([index, step]) => {
        const relativeState = parseInt(index, 10) - currentStep;
        const isOver = relativeState < 0;
        const isActive = relativeState === 0;
        const isUpcoming = relativeState > 0;

        return (
          <div
            key={index}
            className="w-full flex items-center justify-center py-4 px-2 border-r last:border-r-0"
            style={{
              borderBottom: isActive
                ? "3px solid #5d5fef"
                : "3px solid transparent"
            }}
          >
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center border-2 w-10 h-10 rounded-full mr-4 overflow-hidden 
                  ${isOver && "border-indigo-700 bg-indigo-700"}  
                  ${isActive && "border-indigo-700"}  
                  ${isUpcoming && "border-gray-400"}
                `}
              >
                {isOver ? (
                  <div className="h-full w-full flex items-center justify-center">
                    <CheckIcon className="w-6 h-6 text-white" />
                  </div>
                ) : (
                  <span
                    className={`  
                    ${isActive && "text-indigo-700"}  
                    ${isUpcoming && "text-gray-400"}
                  `}
                  >
                    {parseInt(index, 10) + 1}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <div
                  className={`text-sm font-semibold uppercase 
                    ${isOver && "text-gray-700"}  
                    ${isActive && "text-indigo-700"}  
                    ${isUpcoming && "text-gray-400"}
                  `}
                >
                  {step.title}
                </div>
                <div className="text-sm text-gray-400">{step.description}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
