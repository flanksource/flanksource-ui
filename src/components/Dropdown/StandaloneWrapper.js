import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { useUpdateParams } from "../Canary/url";

export const DropdownStandaloneWrapper = ({
  dropdownElem,
  defaultValue,
  paramKey,
  ...rest
}) => {
  const [searchParams] = useSearchParams();
  const updateParams = useUpdateParams();

  const [value, setValue] = useState(
    searchParams.get(paramKey) ?? defaultValue
  );

  useEffect(() => {
    const obj = {};
    obj[paramKey] = value || defaultValue;
    updateParams(obj);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    if (searchParams.get(paramKey) && value !== searchParams.get(paramKey)) {
      setValue(searchParams.get(paramKey));
    }
  }, [searchParams]);

  return React.createElement(dropdownElem.type, {
    value,
    onChange: (val) => setValue(val),
    ...rest
  });
};
