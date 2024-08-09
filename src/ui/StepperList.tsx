import React from "react";

type StepperListProps = {
  items: React.ReactNode[];
  showStepLabel?: boolean;
};

export default function StepperList({
  items,
  showStepLabel = false
}: StepperListProps) {
  return (
    <>
      {items.map((item, index) => (
        <div className="flex" key={item?.toString()}>
          <div className="mr-4 flex flex-col items-center">
            <div className="p-1">
              <div className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200">
                <p className="text-blue-900">{index + 1}</p>
              </div>
            </div>
            {index !== items.length - 1 && (
              <div className="h-full w-px bg-gray-300"></div>
            )}
          </div>
          <div className="flex flex-1 flex-col gap-2 pb-1 pt-1">
            {showStepLabel && (
              <div className="font-semi-bold text-gray-900">
                Step {index + 1}
              </div>
            )}
            <div className="flex flex-col gap-2 text-gray-600">{item}</div>
          </div>
        </div>
      ))}
    </>
  );
}
