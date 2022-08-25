import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useUpdateParams } from "../Canary/url";

export const DropdownStandaloneWrapper = ({
  dropdownElem,
  defaultValue,
  paramKey,
  ...rest
}) => {
  const searchParams = useSearchParams();
  const updateParams = useUpdateParams();
  const paramsValue =
    typeof searchParams[paramKey] !== "undefined"
      ? searchParams[paramKey]
      : defaultValue;
  const [value, setValue] = useState(paramsValue);

  useEffect(() => {
    const obj = {};
    obj[paramKey] = value || defaultValue;
    console.log("update", obj);
    updateParams(obj);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return React.createElement(dropdownElem.type, {
    value,
    onChange: (val) => setValue(val),
    ...rest
  });
};
