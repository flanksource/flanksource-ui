import React, { useState } from "react";
import { EvidenceStepper } from "./components/EvidenceStepper";

export const evidenceSteps = [
  {
    title: "Evidence type",
    description: "Lorem ipsum dolor sit amet",
    component: <div>EvidenceType</div>
  },
  {
    title: "Search",
    description: "Lorem ipsum dolor sit amet",
    component: <div>EvidenceSearch</div>
  },
  {
    title: "Select",
    description: "Lorem ipsum dolor sit amet",
    component: <div>EvidenceSelect</div>
  }
];

interface Props extends React.ComponentPropsWithoutRef<"div"> {
  className?: string;
}

export function EvidenceBuilder({ className, ...rest }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  return (
    <div
      style={{ maxHeight: "calc(100vh - 6rem)" }}
      className={`flex flex-col h-full max-h-screen lol  ${className || ""}`}
      {...rest}
    >
      <div className="text-xl font-medium text-gray-800 mb-4">Add Evidence</div>
      <EvidenceStepper steps={evidenceSteps} currentStep={currentStep} />
      <div className="my-4 flex flex-col overflow-y-auto">
        {evidenceSteps[currentStep].component}
      </div>
      <div className="flex justify-end space-x-2">
        {currentStep > 0 && (
          <button
            type="button"
            onClick={() => setCurrentStep(Math.max(currentStep - 1, 0))}
            className="inline-flex items-center px-3 py-1 mb-1 border border-gray-300 text-sm font-medium rounded text-gray-500  hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back
          </button>
        )}
        <button
          type="button"
          onClick={() => setCurrentStep(Math.min(currentStep + 1, 2))}
          className="inline-flex items-center px-3 py-1 mb-1 border border-transparent text-sm font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Next
        </button>
      </div>
    </div>
  );
}
