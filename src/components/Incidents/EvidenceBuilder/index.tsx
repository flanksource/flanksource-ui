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
      className={`lol flex h-full max-h-screen flex-col ${className || ""}`}
      {...rest}
    >
      <div className="mb-4 text-xl font-medium text-gray-800">Add Evidence</div>
      <EvidenceStepper steps={evidenceSteps} currentStep={currentStep} />
      <div className="my-4 flex flex-col overflow-y-auto">
        {evidenceSteps[currentStep].component}
      </div>
      <div className="flex justify-end space-x-2">
        {currentStep > 0 && (
          <button
            type="button"
            onClick={() => setCurrentStep(Math.max(currentStep - 1, 0))}
            className="mb-1 inline-flex items-center rounded border border-gray-300 px-3 py-1 text-sm font-medium text-gray-500 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Back
          </button>
        )}
        <button
          type="button"
          onClick={() => setCurrentStep(Math.min(currentStep + 1, 2))}
          className="mb-1 inline-flex items-center rounded border border-transparent bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Next
        </button>
      </div>
    </div>
  );
}
