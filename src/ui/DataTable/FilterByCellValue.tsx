import React, { ReactNode, useCallback } from "react";
import {
  PiMagnifyingGlassMinusThin,
  PiMagnifyingGlassPlusThin
} from "react-icons/pi";
import { usePrefixedSearchParams } from "@flanksource-ui/hooks/usePrefixedSearchParams";
import { IconButton } from "../Buttons/IconButton";

type FilterByCellProps = {
  paramKey: string;
  children: ReactNode;
  filterValue: string;
  paramsToReset?: string[];
  paramPrefix?: string;
};

export function FilterByCellValue({
  paramKey,
  children,
  filterValue,
  paramsToReset = [],
  paramPrefix
}: FilterByCellProps) {
  const [, setParams] = usePrefixedSearchParams(paramPrefix, false);

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, action: "include" | "exclude") => {
      e.preventDefault();
      e.stopPropagation();
      setParams((currentParams) => {
        const nextParams = new URLSearchParams(currentParams);
        const currentValue = nextParams.get(paramKey);
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
        nextParams.set(paramKey, updateValue);
        paramsToReset.forEach((param) => {
          nextParams.delete(param);
        });
        return nextParams;
      });
    },
    [filterValue, paramKey, paramsToReset, setParams]
  );

  return (
    <div className="group flex w-full">
      <div className="min-w-0 flex-1 overflow-hidden text-ellipsis">
        {children}
      </div>
      <div className="flex flex-row gap-1 px-1 opacity-0 transition-opacity group-hover:opacity-100">
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
