/* eslint-disable jsx-a11y/anchor-is-valid */
export type Step = {
  position: number;
  label: string;
  finished?: boolean;
  inProgress?: boolean;
};

export type StepProgressBarProps = {
  steps: Step[];
} & React.HTMLProps<HTMLDivElement>;

export function StepProgressBar({ steps, ...rest }: StepProgressBarProps) {
  const fetchStepOption = (step: Step, index: number) => {
    if (step.finished) {
      return (
        <li className="relative md:flex-1 md:flex" key={step.label}>
          <a href="#" className="group flex items-center w-full">
            <span className="px-6 py-1.5 flex items-center text-sm font-medium">
              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-600 rounded-full group-hover:bg-blue-800">
                <svg
                  className="w-6 h-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <span className="ml-4 text-sm font-medium text-gray-900">
                {step.label}
              </span>
            </span>
          </a>

          <div
            className="hidden md:block absolute top-0 right-0 h-full w-5"
            aria-hidden="true"
          >
            <svg
              className="h-full w-full text-gray-300"
              viewBox="0 0 22 80"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M0 -2L20 40L0 82"
                vectorEffect="non-scaling-stroke"
                stroke="currentcolor"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </li>
      );
    } else if (step.inProgress) {
      return (
        <li className="relative md:flex-1 md:flex" key={step.label}>
          <a
            href="#"
            className="px-6 py-1.5 flex items-center text-sm font-medium"
            aria-current="step"
          >
            <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center border-2 border-blue-600 rounded-full">
              <span className="text-blue-600">{step.position}</span>
            </span>
            <span className="ml-4 text-sm font-medium text-blue-600">
              {step.label}
            </span>
          </a>
          {index !== steps.length - 1 && (
            <div
              className="hidden md:block absolute top-0 right-0 h-full w-5"
              aria-hidden="true"
            >
              <svg
                className="h-full w-full text-gray-300"
                viewBox="0 0 22 80"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 -2L20 40L0 82"
                  vectorEffect="non-scaling-stroke"
                  stroke="currentcolor"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
        </li>
      );
    } else {
      return (
        <li className="relative md:flex-1 md:flex" key={step.label}>
          <a href="#" className="group flex items-center">
            <span className="px-6 py-1.5 flex items-center text-sm font-medium">
              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center border-2 border-gray-300 rounded-full group-hover:border-gray-400">
                <span className="text-gray-500 group-hover:text-gray-900">
                  {step.position}
                </span>
              </span>
              <span className="ml-4 text-sm font-medium text-gray-500 group-hover:text-gray-900">
                {step.label}
              </span>
            </span>
          </a>
        </li>
      );
    }
  };

  return (
    <nav aria-label="Progress" {...rest}>
      <ol className="border border-gray-300 rounded-md divide-y divide-gray-300 md:flex md:divide-y-0">
        {steps.map(fetchStepOption)}
      </ol>
    </nav>
  );
}
