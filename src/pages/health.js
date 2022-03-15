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
  defaultGroupSelections,
  defaultTabSelections
} from "../components/Dropdown/lib/lists";
import { TabByDropdown } from "../components/Dropdown/TabByDropdown";
import { Toggle } from "../components/Toggle";
import { LabelFilterDropdown } from "../components/Canary/FilterForm";
import {
  getConciseLabelState,
  groupLabelsByKey,
  separateLabelsByBooleanType
} from "../components/Canary/labels";
import { DropdownMenu } from "../components/DropdownMenu";
import { TristateToggle } from "../components/TristateToggle";
import mixins from "../utils/mixins.module.css";

const getSearchParams = () => getParamsFromURL(window.location.search);

export function HealthPage({ url }) {
  // get search params & listen to params change
  const [searchParams, setSearchParams] = useState(window.location.search);
  useEffect(() => {
    history.listen(({ location }) => {
      setSearchParams(location.search);
    });
  }, []);

  // force-set layout to table
  useEffect(() => {
    updateParams({ layout: "table" });
  }, []);

  const [checks, setChecks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");
  const [booleanLabels, setBooleanLabels] = useState([]);
  const [nonBooleanLabelsGroupedByKeys, setNonBooleanLabelsGroupedByKeys] =
    useState({});

  const labelUpdateCallback = useCallback((newLabels) => {
    const [bl, nbl] = separateLabelsByBooleanType(Object.values(newLabels));
    setBooleanLabels(bl);
    setNonBooleanLabelsGroupedByKeys(groupLabelsByKey(nbl));
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
        <>
          <DropdownStandaloneWrapper
            dropdownElem={<TimeRange />}
            defaultValue={timeRanges[0].value}
            paramKey="timeRange"
            className="w-56 mr-2"
            prefix={
              <>
                <div className="text-xs text-gray-500 mr-2 whitespace-nowrap">
                  Time Range:
                </div>
              </>
            }
          />
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
        </>
      }
      contentClass="p-0"
    >
      <div className="flex flex-row">
        <SidebarSticky>
          <SectionTitle className="mb-4">Filter by Health</SectionTitle>
          <div className="mb-4 flex items-center">
            <div className="h-9 flex items-center">
              <HidePassingToggle />
            </div>
            <div className="text-sm text-gray-800 mb-0">Hide Passing</div>
          </div>

          <SectionTitle className="mb-4">Filter by Label</SectionTitle>
          <div className="mb-4 mr-2 w-full">
            {Object.entries(nonBooleanLabelsGroupedByKeys).map(
              ([labelKey, labels]) => (
                <div key={labelKey} className="mb-2">
                  <div className="text-xs whitespace-nowrap overflow-ellipsis w-full overflow-hidden mb-1">
                    {labelKey}
                  </div>
                  <MultiSelectLabelsDropdownStandalone
                    labels={labels}
                    selectAllByDefault
                  />
                </div>
              )
            )}
          </div>
          <div className="mb-4 mr-2 w-full">
            <TristateLabels
              labels={booleanLabels}
              buttonTitle="Boolean labels"
            />
          </div>
        </SidebarSticky>

        <div className="flex-grow p-6">
          <div className="flex flex-wrap mb-2">
            <div className="mb-4 mr-2">
              <DropdownStandaloneWrapper
                dropdownElem={<GroupByDropdown />}
                checks={checks}
                defaultValue={defaultGroupSelections.name.value}
                paramKey="groupBy"
                className="w-64"
                prefix={
                  <>
                    <div className="text-xs text-gray-500 mr-2 whitespace-nowrap">
                      Group By:
                    </div>
                  </>
                }
              />
            </div>
            <div className="mb-4 mr-2">
              <DropdownStandaloneWrapper
                dropdownElem={<TabByDropdown />}
                defaultValue={defaultTabSelections.namespace.value}
                paramKey="tabBy"
                checks={checks}
                emptyable
                className="w-64"
                prefix={
                  <>
                    <div className="text-xs text-gray-500 mr-2 whitespace-nowrap">
                      Tab By:
                    </div>
                  </>
                }
              />
            </div>
          </div>
          <CanaryInterfaceMinimal
            checks={checks}
            handleFetch={handleFetch}
            onLabelFiltersCallback={labelUpdateCallback}
          />
        </div>
      </div>
    </SearchLayout>
  );
}

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

export const MultiSelectLabelsDropdownStandalone = ({
  labels = []
  // selectAllByDefault
}) => {
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [dropdownValue, setDropdownValue] = useState([]);
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

      // if (isFirstLoad && selected.length === 0 && selectAllByDefault) {
      //   setDropdownValue(all);
      // } else {
      setDropdownValue(selected);
      // }

      // if (selected.length === 0) {
      //   // if empty, include alall items
      //   all.forEach((selection) => {
      //     labelState[selection.value] = 1;
      //   });
      // }

      const conciseLabelState = getConciseLabelState(labelState);
      updateParams({ labels: conciseLabelState });
      setIsFirstLoad(false);
    },
    [
      isFirstLoad
      //  selectAllByDefault
    ]
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
};

export const TristateLabels = ({ labels = [] }) => {
  const [labelStates, setLabelStates] = useState({});

  // first load or label change: set label statesgood hooker irl
  useEffect(() => {
    const { labels: urlLabelState = {} } = decodeUrlSearchParams(
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
    <div className="w-full break">
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
              className="mb-2 flex items-center"
              labelClass="ml-3 text-xs text-left text-gray-700 break-all overflow-ellipsis overflow-x-hidden"
              label={label}
            />
          </div>
        ))}
    </div>
  );
};

const SectionTitle = ({ className, children, ...props }) => (
  <div
    className={`uppercase font-semibold text-sm mb-3 text-indigo-700 ${className}`}
    {...props}
  >
    {children}
  </div>
);

const SidebarSticky = ({
  className,
  style,
  children,
  topHeight = 64,
  ...props
}) => (
  <div
    className={className || "flex flex-col w-72 border-r"}
    style={style || { minHeight: `calc(100vh - ${topHeight}px)` }}
    {...props}
  >
    <div
      className={`h-full overflow-y-auto overflow-x-hidden p-4 ${mixins.appleScrollbar}`}
      style={{
        position: "sticky",
        top: `${topHeight}px`,
        maxHeight: `calc(100vh - ${topHeight}px)`
      }}
    >
      {children}
    </div>
  </div>
);
