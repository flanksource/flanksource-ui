import clsx from "clsx";
import { AddResponderAction } from "./AddResponder";

type ActionButtonGroupProps = {
  previousAction?: AddResponderAction;
  nextAction?: AddResponderAction;
} & React.HTMLProps<HTMLDivElement>;

export function ActionButtonGroup({
  previousAction,
  nextAction,
  className,
  ...rest
}: ActionButtonGroupProps) {
  return (
    <div
      className={clsx(
        "flex items-end justify-between rounded-t-lg bg-gray-100 px-8 pb-4",
        className
      )}
      {...rest}
    >
      <div className="flex flex-1">
        {previousAction && (
          <button
            disabled={previousAction.disabled}
            type="submit"
            className={clsx(
              !previousAction.primary
                ? "inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:text-sm"
                : "btn-primary",
              "mt-4",
              {
                "btn-disabled": previousAction.disabled
              }
            )}
            onClick={previousAction.handler}
          >
            {previousAction.label}
          </button>
        )}
      </div>
      <div className="flex flex-1 justify-end">
        {nextAction && (
          <button
            disabled={nextAction.disabled}
            type="submit"
            className={clsx(
              !nextAction.primary
                ? "inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:text-sm"
                : "btn-primary",
              "mt-4",
              {
                "btn-disabled": nextAction.disabled
              }
            )}
            onClick={nextAction.handler}
          >
            {nextAction.label}
          </button>
        )}
      </div>
    </div>
  );
}
