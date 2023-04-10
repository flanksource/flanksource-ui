import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Dropdown } from ".";
import { useUpdateParams } from "../Canary/url";

export type DropdownStandaloneWrapperProps = {
  dropdownElem: React.ReactElement;
  defaultValue: string;
  paramKey: string;
} & React.ComponentProps<typeof Dropdown>;

export function DropdownStandaloneWrapper({
  dropdownElem,
  defaultValue,
  paramKey,
  ...rest
}: DropdownStandaloneWrapperProps) {
  const [searchParams] = useSearchParams({
    [paramKey]: defaultValue
  });

  const value = searchParams.get(paramKey) || defaultValue;

  const updateParams = useUpdateParams();

  return React.createElement(dropdownElem.type, {
    value,
    onChange: (val: any) =>
      updateParams({
        [paramKey]: val
      }),
    ...rest
  });
}
