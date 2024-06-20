import { useAtom } from "jotai";
import { useEffect } from "react";
import {
  DropdownStandaloneWrapper,
  DropdownStandaloneWrapperProps
} from "../../Dropdown/StandaloneWrapper";
import { useUpdateParams } from "../url";
import { healthSettingsAtom } from "../useHealthUserSettings";

export function DropdownWrapper({
  defaultValue,
  dropdownElem,
  paramKey,
  ...rest
}: DropdownStandaloneWrapperProps) {
  const updateParams = useUpdateParams();
  const [settings] = useAtom(healthSettingsAtom);
  const value = settings[paramKey] ?? defaultValue;

  useEffect(() => {
    if (value !== defaultValue && value !== null) {
      updateParams({ [paramKey]: value });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue, paramKey, value]);

  return (
    <DropdownStandaloneWrapper
      dropdownElem={dropdownElem}
      defaultValue={value || defaultValue}
      paramKey={paramKey}
      {...rest}
    />
  );
}
