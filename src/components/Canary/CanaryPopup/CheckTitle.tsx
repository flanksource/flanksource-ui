import clsx from "clsx";
import React from "react";
import { HealthCheck } from "../../../types/healthChecks";
import { usePrevious } from "../../../utils/hooks";
import { Badge } from "../../Badge";
import { Icon } from "../../Icon";

type CheckTitleProps = Omit<React.HTMLProps<HTMLDivElement>, "size"> & {
  check?: Partial<HealthCheck>;
  size?: string;
};

export function CheckTitle({
  check,
  className,
  size = "large",
  ...rest
}: CheckTitleProps) {
  const prevCheck = usePrevious(check);
  const validCheck = check || prevCheck;

  return (
    <div className={`flex flex-row items-center ${className}`} {...rest}>
      <div
        className={clsx(
          "flex-shrink-0",
          size === "large" ? "w-14 pr-1" : "pr-2"
        )}
      >
        <Icon
          name={validCheck?.icon || validCheck?.type}
          className={size === "large" ? "w-14 h-auto" : "w-6 h-auto"}
        />
      </div>
      <div
        className={clsx("overflow-hidden", size === "large" ? " mr-10" : "")}
      >
        <div className="flex flex-row items-center">
          <span
            title={validCheck?.name}
            className={clsx(
              "text-gray-800 font-semibold whitespace-nowrap overflow-ellipsis overflow-hidden pr-4",
              size === "large" ? "text-2xl" : ""
            )}
          >
            {validCheck?.name}
          </span>{" "}
          {size === "large" && (
            <span
              className="hidden sm:block "
              title={`Namespace for ${validCheck?.name}`}
              style={{ paddingTop: "1px" }}
            >
              <Badge text={validCheck?.namespace ?? ""} />
            </span>
          )}
        </div>
        <div
          title={`Endpoint for ${validCheck?.name}`}
          className="text-sm text-gray-400 mt-0.5 overflow-x-hidden overflow-ellipsis break-all"
        >
          {validCheck?.endpoint}
        </div>
        <span
          className="block sm:hidden mt-2"
          title={`Namespace for ${validCheck?.name}`}
        >
          <Badge text={validCheck?.namespace ?? ""} />
        </span>
      </div>
    </div>
  );
}
