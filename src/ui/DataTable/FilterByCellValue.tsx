import React, { ReactNode, useCallback } from "react";
import {
  PiMagnifyingGlassMinusThin,
  PiMagnifyingGlassPlusThin
} from "react-icons/pi";
import { useSearchParams } from "react-router-dom";
import { IconButton } from "../Buttons/IconButton";

type FilterByCellProps = {
  paramKey: string;
  children: ReactNode;
  filterValue: string;
  paramsToReset?: string[];
};

export function FilterByCellValue({
  paramKey,
  children,
  filterValue,
  paramsToReset = []
}: FilterByCellProps) {
  const [params, setParams] = useSearchParams();

  console.log("FilterByCellValue", paramKey, filterValue, paramsToReset);

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, action: "include" | "exclude") => {
      e.preventDefault();
      e.stopPropagation();
      const currentValue = params.get(paramKey);
      const arrayValue = currentValue?.split(",") || [];
      // if include, we need to remove all exclude values and
      // if exclude, we need to remove all include values
      const newValues = arrayValue.filter(
        (value) =>
          (action === "include" && parseInt(value.split(":")[1]) === 1) ||
          (action === "exclude" && parseInt(value.split(":")[1]) === -1)
      );
      // append the new value
      const updateValue = newValues
        .concat(
          `${filterValue.replaceAll(",", "||||").replaceAll(":", "____")}:${
            action === "include" ? 1 : -1
          }`
        )
        // remove duplicates
        .filter((value, index, self) => self.indexOf(value) === index)
        .join(",");
      params.set(paramKey, updateValue);
      paramsToReset.forEach((param) => params.delete(param));
      setParams(params);
    },
    [filterValue, paramKey, params, paramsToReset, setParams]
  );

  return (
    <div className="group flex w-full">
      <div className="flex-1 overflow-x-hidden text-ellipsis">{children}</div>
      <div className="hidden flex-row gap-1 px-1 group-hover:flex">
        <IconButton
          onClick={(e) => onClick(e, "include")}
          icon={<PiMagnifyingGlassPlusThin size={18} />}
          title="Include"
        />
        <IconButton
          onClick={(e) => onClick(e, "exclude")}
          icon={<PiMagnifyingGlassMinusThin size={18} />}
          title="Exclude"
        />
      </div>
    </div>
  );
}

export default React.memo(FilterByCellValue);
