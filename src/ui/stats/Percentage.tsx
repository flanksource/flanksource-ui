import clsx from "clsx";

export function percentage(value: number, precision = 0) {
  if (value > 100) {
    return (value / 100).toFixed(Math.max(precision, 1)) + "x";
  }
  return value.toFixed(precision) + "%";
}
export default function Percentage({
  value,
  increaseColor = "green",
  decreaseColor = "red",
  className = " h-4 w-4 ",
  precision = 0
}: {
  value: number;
  precision?: number;
  increaseColor?: string;
  decreaseColor?: string;
  className?: string;
}) {
  if (Math.abs(value) > 100) {
  }

  if (value > 0) {
    return (
      <div
        className={`bg-${increaseColor}-100 text-${increaseColor}-800 ml-1 inline-flex items-baseline rounded-full px-1.5 py-0.5 text-xs font-medium md:mt-2 lg:mt-0`}
      >
        <svg
          className={clsx(
            className,
            `-ml-1 mr-0.5 flex-shrink-0 self-center text-${increaseColor}-500`
          )}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
            clipRule="evenodd"
          />
        </svg>
        <span className="sr-only"> Increased by </span>
        {percentage(value, precision)}
      </div>
    );
  } else {
    return (
      <div
        className={`ml-1 inline-flex items-baseline rounded-full px-1.5 py-0.5 text-xs font-medium bg-${decreaseColor}-100 text-${decreaseColor}-800 md:mt-2 lg:mt-0`}
      >
        <svg
          className={clsx(
            className,
            `-ml-1 mr-0.5 flex-shrink-0 self-center text-${decreaseColor}-500`
          )}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
            clipRule="evenodd"
          />
        </svg>
        <span className="sr-only"> Decreased by </span>
        {percentage(Math.abs(value), precision)}
      </div>
    );
  }
}
