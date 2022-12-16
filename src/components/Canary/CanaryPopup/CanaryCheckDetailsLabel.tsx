import { useEffect } from "react";
import ReactTooltip from "react-tooltip";
import { HealthCheck } from "../../../types/healthChecks";

type CanaryCheckDetailsLabelProps = {
  check?: Partial<HealthCheck>;
};

export function CanaryCheckDetailsLabel({
  check
}: CanaryCheckDetailsLabelProps) {
  useEffect(() => {
    ReactTooltip.rebuild();
  });

  if (!check?.labels) {
    return null;
  }

  return (
    <div className="flex flex-wrap ">
      {Object.entries(check?.labels).map((entry) => {
        const key = entry[0];
        const value = entry[1] === "true" || entry[1] === true ? "" : entry[1];

        return (
          <div
            data-tip={value === "" ? key : `${key}: ${value}`}
            className="max-w-full h-auto overflow-hidden text-ellipsis bg-blue-100 border border-gray-300 px-1 py-0.75 m-0.5 rounded-md text-gray-600 font-semibold text-xs"
            key={key}
          >
            {value === "" ? (
              key
            ) : (
              <>
                {key}: <span className="font-light">{value}</span>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
