import { useCallback, useEffect, useState } from "react";
import { LabelFilterDropdown } from "../FilterForm";
import { getConciseLabelState } from "../labels";
import { decodeUrlSearchParams, useUpdateParams } from "../url";

export function MultiSelectLabelsDropdownStandalone({ labels = [] }) {
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [dropdownValue, setDropdownValue] = useState([]);
  const updateParams = useUpdateParams();

  const handleChange = useCallback(
    (selected: any, all: any) => {
      const { labels: urlLabelState } = decodeUrlSearchParams(
        window.location.search
      );
      const labelState = { ...urlLabelState };

      if (!isFirstLoad) {
        all.forEach((selection: any) => {
          // set unselected labels to 0
          labelState[selection.value] = 0;
        });
      }

      selected.forEach((selection: any) => {
        // set selected labels to 1
        labelState[selection.value] = 1;
      });

      setDropdownValue(selected);

      const conciseLabelState = getConciseLabelState(labelState);
      updateParams({ labels: conciseLabelState });
      setIsFirstLoad(false);
    },
    [isFirstLoad, updateParams]
  );

  useEffect(() => {
    setIsFirstLoad(true);
  }, []);

  return (
    <LabelFilterDropdown
      name="HealthMultiLabelFilter"
      labels={labels}
      onChange={handleChange}
      loadFromURL
      value={dropdownValue}
    />
  );
}
