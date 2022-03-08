import React, { useEffect, useState } from "react";
import { updateParams } from "../Canary/url";
import { getParamsFromURL } from "../Canary/utils";

const getSearchParams = () => getParamsFromURL(window.location.search);

export const DropdownStandaloneWrapper = ({
  dropdownElem,
  defaultValue,
  paramKey,
  ...rest
}) => {
  const searchParams = getSearchParams();
  const paramsValue =
    typeof searchParams[paramKey] !== "undefined"
      ? searchParams[paramKey]
      : null;
  const [value, setValue] = useState(paramsValue || defaultValue);
  useEffect(() => {
    const obj = {};
    obj[paramKey] = value;
    updateParams(obj);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return React.createElement(dropdownElem.type, {
    value,
    onChange: (val) => {
      setValue(val);
      const obj = {};
      obj[paramKey] = val;
      updateParams(obj);
    },
    ...rest
  });
};
