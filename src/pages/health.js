import React, { useCallback, useEffect, useMemo, useState } from "react";
import history from "history/browser";
import { debounce, isEmpty, throttle } from "lodash";
import { ChevronDownIcon } from "@heroicons/react/outline";
import { SearchLayout } from "../components/Layout";
import {
  encodeObjectToUrlSearchParams,
  updateParams,
  decodeUrlSearchParams
} from "../components/Canary/url";
import { CanarySearchBar } from "../components/Canary/CanarySearchBar";
import { getParamsFromURL } from "../components/Canary/utils";
import { CanaryInterfaceMinimal } from "../components/CanaryInterface/minimal";
import { GroupByDropdown } from "../components/Dropdown/GroupByDropdown";
import { DropdownStandaloneWrapper } from "../components/Dropdown/StandaloneWrapper";
import { TimeRange, timeRanges } from "../components/Dropdown/TimeRange";
import {
  LayoutDropdown,
  layoutItems
} from "../components/Dropdown/LayoutDropdown";
import { PivotByDropdown } from "../components/Dropdown/PivotByDropdown";
import {
  defaultCellTypeSelections,
  defaultGroupSelections,
  defaultPivotSelections,
  defaultTabSelections
} from "../components/Dropdown/lib/lists";
import { TabByDropdown } from "../components/Dropdown/TabByDropdown";
import { PivotCellTypeDropdown } from "../components/Dropdown/PivotCellTypeDropdown";
import { PivotLabelDropdown } from "../components/Dropdown/PivotLabelDropdown";
import { Toggle } from "../components/Toggle";
import { LabelFilterDropdown } from "../components/Canary/FilterForm";
import {
  getConciseLabelState,
  separateLabelsByBooleanType
} from "../components/Canary/labels";
import { DropdownMenu } from "../components/DropdownMenu";
import { parse } from "qs";
import { TristateToggle } from "../components/TristateToggle";

const getSearchParams = () => getParamsFromURL(window.location.search);

export function HealthPage({ url }) {
  // get search params & listen to params change
  const [searchParams, setSearchParams] = useState(window.location.search);
  useEffect(() => {
    history.listen(({ location }) => {
      setSearchParams(location.search);
    });
  }, []);

  const { pivotBy, layout } = decodeUrlSearchParams(searchParams);

  const [checks, setChecks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");
  const [booleanLabels, setBooleanLabels] = useState([]);
  const [nonBooleanLabels, setNonBooleanLabels] = useState([]);

  const labelUpdateCallback = useCallback((newLabels) => {
    const [bl, nbl] = separateLabelsByBooleanType(Object.values(newLabels));
    setBooleanLabels(bl);
    setNonBooleanLabels(nbl);
  }, []);

  const handleSearch = debounce((value) => {
    updateParams({ query: value });
  }, 400);

  const handleFetch = useMemo(
    () =>
      throttle(() => {
        if (url == null) {
          return;
        }
        const timeRange = getParamsFromURL(window.location.search)?.timeRange;
        const params = encodeObjectToUrlSearchParams({
          start:
            isEmpty(timeRange) || timeRange === "undefined" ? "1h" : timeRange
        });
        setIsLoading(true);
        fetch(`${url}?${params}`)
          .then((result) => result.json())
          .then((e) => {
            if (!isEmpty(e.error)) {
              // eslint-disable-next-line no-console
              console.error(e.error);
            } else {
              setChecks(e.checks);
              setLastUpdated(new Date());
            }
          })
          .finally(() => {
            setIsLoading(false);
          });
      }, 1000),
    []
  );

  return (
    <SearchLayout
      title={<h1 className="text-xl font-semibold">Health</h1>}
      onRefresh={handleFetch}
      extra={
        <CanarySearchBar
          onChange={(e) => handleSearch(e.target.value)}
          onSubmit={(value) => handleSearch(value)}
          onClear={() => handleSearch("")}
          className=""
          inputClassName="w-full py-2 mb-px"
          inputOuterClassName="w-80"
          placeholder="Search by name, description, or endpoint"
          defaultValue={getSearchParams()?.query}
        />
      }
    >
      <SectionTitle>Controls</SectionTitle>
      <div className="flex flex-wrap mb-2">
        <div className="mb-4 mr-2">
          <div className="text-sm text-gray-800 mb-2">Time Range</div>
          <DropdownStandaloneWrapper
            dropdownElem={<TimeRange />}
            defaultValue={timeRanges[0].value}
            paramKey="timeRange"
            className="w-52"
          />
        </div>
        <div className="mb-4 mr-2">
          <div className="text-sm text-gray-800 mb-2">Layout</div>
          <DropdownStandaloneWrapper
            dropdownElem={<LayoutDropdown />}
            defaultValue={layoutItems.table.value}
            paramKey="layout"
            className="w-52"
          />
        </div>
        {layout === "table" && (
          <>
            <div className="mb-4 mr-2">
              <div className="text-sm text-gray-800 mb-2">Group By</div>
              <DropdownStandaloneWrapper
                dropdownElem={<GroupByDropdown />}
                checks={checks}
                defaultValue={defaultGroupSelections.name.value}
                paramKey="groupBy"
                className="w-52"
              />
            </div>
          </>
        )}

        <div className="mb-4 mr-2">
          <div className="text-sm text-gray-800 mb-2">Tab By</div>
          <DropdownStandaloneWrapper
            dropdownElem={<TabByDropdown />}
            defaultValue={defaultTabSelections.namespace.value}
            paramKey="tabBy"
            checks={checks}
            emptyable
            className="w-52"
          />
        </div>
      </div>
      {layout === "table" && (
        <div className="mb-2">
          <SectionTitle>Pivot Settings</SectionTitle>
          <div className="flex flex-wrap">
            <div className="mb-4 mr-2">
              <div className="text-sm text-gray-800 mb-2">Pivot By</div>
              <DropdownStandaloneWrapper
                dropdownElem={<PivotByDropdown />}
                defaultValue={defaultPivotSelections.none.value}
                paramKey="pivotBy"
                checks={checks}
                className="w-52"
              />
            </div>
            {!(pivotBy == null || pivotBy === "none") && (
              <>
                {pivotBy !== "none" && (
                  <div className="mb-4 mr-2">
                    <div className="text-sm text-gray-800 mb-2">
                      Pivot Cell Type
                    </div>
                    <DropdownStandaloneWrapper
                      dropdownElem={<PivotCellTypeDropdown />}
                      defaultValue={defaultCellTypeSelections.uptime.value}
                      paramKey="pivotCellType"
                      checks={checks}
                      className="w-52"
                    />
                  </div>
                )}
                {pivotBy === "labels" && (
                  <div className="mb-4 mr-2">
                    <div className="text-sm text-gray-800 mb-2">
                      Pivot Label
                    </div>
                    <DropdownStandaloneWrapper
                      dropdownElem={<PivotLabelDropdown />}
                      placeholder="Please select a label"
                      emptyable
                      defaultValue="null"
                      paramKey="pivotLabel"
                      checks={checks}
                      className="w-52"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      <SectionTitle>Filters</SectionTitle>
      <div className="flex flex-wrap mb-2">
        <div className="mb-4 mr-2 w-72">
          <div className="text-sm text-gray-800 mb-2">Non-Boolean Labels</div>
          <MultiSelectLabelsDropdownStandalone labels={nonBooleanLabels} />
        </div>
        <div className="mb-4 mr-2 w-72">
          <div className="text-sm text-gray-800 mb-2">Boolean Labels</div>
          <SimpleLabelsDropdownStandalone
            labels={booleanLabels}
            buttonTitle="Boolean labels"
          />
        </div>
        <div className="mb-4 mx-2">
          <div className="text-sm text-gray-800 mb-2">Hide Passing</div>
          <div className="h-9 flex items-center">
            <HidePassingToggle />
          </div>
        </div>
      </div>
      <CanaryInterfaceMinimal
        checks={checks}
        handleFetch={handleFetch}
        onLabelFiltersCallback={labelUpdateCallback}
      />
    </SearchLayout>
  );
}

const SectionTitle = ({ className, children, ...props }) => (
  <div
    className={`uppercase font-semibold text-sm mb-3 text-indigo-700 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const HidePassingToggle = ({ defaultValue = true }) => {
  const searchParams = getParamsFromURL(window.location.search);
  const paramsValue = searchParams.hidePassing
    ? searchParams.hidePassing === "true"
    : null;

  const [value, setValue] = useState(paramsValue ?? defaultValue);

  useEffect(() => {
    updateParams({ hidePassing: value });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Toggle
      value={value}
      onChange={(val) => {
        setValue(val);
        updateParams({ hidePassing: val });
      }}
    />
  );
};

export const MultiSelectLabelsDropdownStandalone = ({ labels = [] }) => {
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const handleChange = useCallback(
    (selected, all) => {
      const { labels: urlLabelState } = decodeUrlSearchParams(
        window.location.search
      );
      const labelState = { ...urlLabelState };

      if (!isFirstLoad) {
        all.forEach((selection) => {
          // set unselected labels to 0
          labelState[selection.value] = 0;
        });
      }

      selected.forEach((selection) => {
        // set selected labels to 1
        labelState[selection.value] = 1;
      });
      const conciseLabelState = getConciseLabelState(labelState);
      updateParams({ labels: conciseLabelState });
    },
    [isFirstLoad]
  );

  useEffect(() => {
    setIsFirstLoad(false);
  }, []);
  return (
    <LabelFilterDropdown labels={labels} onChange={handleChange} loadFromURL />
  );
};

export const SimpleLabelsDropdownStandalone = ({
  labels = [],
  buttonTitle
}) => {
  const [labelStates, setLabelStates] = useState({});

  // first load or label change: set label states
  useEffect(() => {
    const { labels: urlLabelState } = decodeUrlSearchParams(
      window.location.search
    );
    const labelMap = labels.reduce((acc, current) => {
      acc[current.id] = true;
      return acc;
    }, {});
    const newLabelStates = Object.entries(urlLabelState).reduce(
      (acc, [k, v]) => {
        if (Object.prototype.hasOwnProperty.call(labelMap, k)) {
          acc[k] = v;
        }
        return acc;
      },
      {}
    );
    setLabelStates(newLabelStates);
  }, [labels]);

  const handleToggleChange = (labelKey, value) => {
    const { labels: urlLabelState } = decodeUrlSearchParams(
      window.location.search
    );
    const newState = { ...urlLabelState };
    newState[labelKey] = value;
    const conciseLabelState = getConciseLabelState(newState);
    updateParams({ labels: conciseLabelState });
  };

  return (
    <DropdownMenu
      menuDropdownStyle={{ zIndex: "5" }}
      buttonClass="w-full"
      buttonElement={
        <div
          className="border border-gray-300 w-full flex items-center justify-between px-2 py-2"
          style={{ height: "38px", borderRadius: "4px" }}
        >
          <span className="text-sm text-gray-500">{buttonTitle}</span>
          <ChevronDownIcon
            style={{
              height: "20px",
              color: "#8f8f8f",
              marginLeft: "12px"
            }}
          />
        </div>
      }
      content={
        <div className="px-4 py-2">
          {labels
            .filter((o) => o && o !== undefined)
            .map((label) => (
              <div key={label.id}>
                <TristateToggle
                  key={label.key}
                  value={
                    Object.prototype.hasOwnProperty.call(labelStates, label.id)
                      ? labelStates[label.id]
                      : 0
                  }
                  onChange={(v) => handleToggleChange(label.id, v)}
                  className="mb-2"
                  label={label}
                />
              </div>
            ))}
        </div>
      }
    />
  );
};
