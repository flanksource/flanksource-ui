import { CheckIcon } from "@heroicons/react/solid";

export function EvidenceStepper({ currentStep, steps, ...rest }) {
  return (
    <div className={`flex flex-row border ${rest.className}`} {...rest}>
      {Object.entries(steps).map(([index, step]) => {
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
                  ${isOver && "border-blue-700 bg-blue-700"}
                  ${isActive && "border-blue-700"}
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
                    ${isActive && "text-blue-700"}
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
                    ${isActive && "text-blue-700"}
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
