import React from "react";
import { usePrevious } from "../../../utils/hooks";
import { Badge } from "../../Badge";
import { Icon } from "../../Icon";

export function CheckTitle({ check, className, ...rest }) {
  const prevCheck = usePrevious(check);
  const validCheck = check || prevCheck;

  return (
    <div className={`flex flex-row ${className}`} {...rest}>
      <div className="w-14 flex-shrink-0 pr-1">
        <Icon
          name={validCheck?.icon || validCheck?.type}
          size="2xl"
        />
      </div>
      <div className="overflow-hidden mr-10">
        <div className="flex flex-row items-center">
          <span
            title={validCheck?.name}
            className="text-gray-800 text-2xl font-semibold whitespace-nowrap overflow-ellipsis overflow-hidden pr-4"
          >
            {validCheck?.name}
          </span>
          <span
            className="hidden sm:block "
            title={`Namespace for ${validCheck?.name}`}
            style={{ paddingTop: "1px" }}
          >
            <Badge text={validCheck?.namespace} />
          </span>
        </div>
        {true && (
          <div
            title={`Endpoint for ${validCheck?.name}`}
            className="text-sm text-gray-400 mt-0.5 overflow-x-hidden overflow-ellipsis break-all"
          >
            {validCheck?.endpoint}
          </div>
        )}
        <span
          className="block sm:hidden mt-2"
          title={`Namespace for ${validCheck?.name}`}
        >
          <Badge text={validCheck?.namespace} />
        </span>
      </div>
    </div>
  );
}
