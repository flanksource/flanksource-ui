import React, { useCallback, useEffect, useState } from "react";
import { debounce, isEmpty, throttle } from "lodash";
import history from "history/browser";
import {
  encodeObjectToUrlSearchParams,
  updateParams,
  decodeUrlSearchParams
} from "./url";
import { CanarySearchBar } from "./CanarySearchBar";
import { getParamsFromURL } from "./utils";
import { CanaryInterfaceMinimal } from "../CanaryInterface/minimal";
import { GroupByDropdown } from "../Dropdown/GroupByDropdown";
import { DropdownStandaloneWrapper } from "../Dropdown/StandaloneWrapper";
import { TimeRange, timeRanges } from "../Dropdown/TimeRange";
import { defaultTabSelections } from "../Dropdown/lib/lists";
import { TabByDropdown } from "../Dropdown/TabByDropdown";
import { Toggle } from "../Toggle";
import { LabelFilterDropdown } from "./FilterForm";
import {
  getConciseLabelState,
  groupLabelsByKey,
  separateLabelsByBooleanType
} from "./labels";
import { TristateToggle } from "../TristateToggle";
import { StatCard } from "../StatCard";
import { isHealthy } from "./filter";
import mixins from "../../utils/mixins.module.css";

const getSearchParams = () => getParamsFromURL(window.location.search);

const getPassingCount = (checks) => {
  let count = 0;
  checks.forEach((check) => {
    if (isHealthy(check)) {
      count += 1;
    }
  });
  return count;
};

export function Canary({
  url = "/canary/api",
  refreshInterval = 15 * 1000,
  topLayoutOffset = 0,
  hideSearch,
  hideTimeRange
}) {
  // force-set layout to table
  useEffect(() => {
    updateParams({ layout: "table" });
  }, []);

  const [checks, setChecks] = useState([]);
  const [filteredChecks, setFilteredChecks] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [isLoading, setIsLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [lastUpdated, setLastUpdated] = useState("");
  const [filteredLabels, setFilteredLabels] = useState();
  const [passing, setPassing] = useState({
    checks: 0,
    filtered: 0
  });
  const [componentUnMounted, setComponentUnMounted] = useState(false);

  const labelUpdateCallback = useCallback((newLabels) => {
    setFilteredLabels(newLabels);
  }, []);

  useEffect(() => {
    setPassing({ ...passing, checks: getPassingCount(checks) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checks]);

  useEffect(() => {
    setPassing({ ...passing, filtered: getPassingCount(filteredChecks) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredChecks]);

  const updateFilteredChecks = useCallback((newFilteredChecks) => {
    setFilteredChecks(newFilteredChecks || []);
  }, []);

  const handleFetch = throttle(() => {
    if (url == null) {
      return;
    }
    const timeRange = getParamsFromURL(window.location.search)?.timeRange;
    const params = encodeObjectToUrlSearchParams({
      start: isEmpty(timeRange) || timeRange === "undefined" ? "1h" : timeRange
    });
    setIsLoading(true);
    fetch(`${url}?${params}`)
      .then((result) => result.json())
      .then((e) => {
        if (componentUnMounted) {
          return;
        }
        if (!isEmpty(e.error)) {
          // eslint-disable-next-line no-console
          console.error(e.error);
        } else {
          setChecks(e.checks);
          setLastUpdated(new Date());
        }
      })
      .finally(() => {
        if (componentUnMounted) {
          return;
        }
        setIsLoading(false);
      });
  }, 1000);

  useEffect(() => {
    handleFetch();
    const intervalRef = setInterval(handleFetch, refreshInterval);
    return () => {
      clearInterval(intervalRef);
      setComponentUnMounted(true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshInterval]);

  // listen to URL params change
  const [searchParams, setSearchParams] = useState(window.location.search);
  useEffect(() => {
    const unlisten = history.listen(({ location }) => {
      setSearchParams(location.search);
      handleFetch();
    });
    return () => {
      unlisten();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = debounce((value) => {
    updateParams({ query: value });
  }, 400);

  return (
    <div className="flex flex-row place-content-center">
      <SidebarSticky topHeight={topLayoutOffset}>
        <div className="mb-4">
          <StatCard
            title="All Checks"
            className="mb-4"
            customValue={
              <>
                {checks.length || 0}
                <span className="text-xl font-light">
                  {" "}
                  (<span className="text-green-500">{passing.checks}</span>/
                  <span className="text-red-500">
                    {" "}
                    {checks.length - passing.checks}
                  </span>
                  )
                </span>
              </>
            }
          />

          {filteredChecks.length !== checks.length && (
            <StatCard
              title="Filtered Checks"
              className="mb-4"
              customValue={
                <>
                  {filteredChecks.length}
                  <span className="text-xl  font-light">
                    {" "}
                    (<span className="text-green-500">{passing.filtered}</span>/
                    <span className="text-red-500">
                      {filteredChecks.length - passing.filtered}
                    </span>
                    )
                  </span>
                </>
              }
            />
          )}
        </div>

        <SectionTitle className="mb-4">Filter by Health</SectionTitle>
        <div className="mb-6 flex items-center">
          <div className="h-9 flex items-center">
            <HidePassingToggle />
          </div>
          <div className="text-sm text-gray-800 mb-0">Hide Passing</div>
        </div>
        <SectionTitle className="mb-5 flex justify-between items-center">
          Filter by Label{" "}
          {/* <button
              type="button"
              onClick={() => {
                updateParams({ labels: {} });
              }}
              className="bg-gray-200 text-gray-500 font-semibold text-xs px-2 py-1 rounded-md"
            >
              Clear All
            </button> */}
        </SectionTitle>
        <div className="mb-4 mr-2 w-full">
          <LabelFilterList labels={filteredLabels} />
        </div>
      </SidebarSticky>

      <div className="flex-grow p-6 max-w-7xl">
        {!hideSearch && (
          <div className="flex flex-wrap mb-2">
            <CanarySearchBar
              onChange={(e) => handleSearch(e.target.value)}
              onSubmit={(value) => handleSearch(value)}
              onClear={() => handleSearch("")}
              style={{ maxWidth: "480px", width: "100%" }}
              inputClassName="w-full py-2 mr-2 mb-px"
              inputOuterClassName="w-full"
              placeholder="Search by name, description, or endpoint"
              defaultValue={getSearchParams()?.query}
            />
          </div>
        )}

        <div className="flex flex-wrap mb-2">
          <div className="mb-2 mr-2">
            <DropdownStandaloneWrapper
              dropdownElem={<GroupByDropdown />}
              checks={checks}
              defaultValue="canaryName"
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
          <div className="mb-2 mr-2">
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
          {!hideTimeRange && (
            <DropdownStandaloneWrapper
              dropdownElem={<TimeRange />}
              defaultValue={timeRanges[0].value}
              paramKey="timeRange"
              className="w-56 mb-2 mr-2"
              prefix={
                <>
                  <div className="text-xs text-gray-500 mr-2 whitespace-nowrap">
                    Time Range:
                  </div>
                </>
              }
            />
          )}
        </div>
        <CanaryInterfaceMinimal
          checks={checks}
          searchParams={searchParams}
          onLabelFiltersCallback={labelUpdateCallback}
          onFilterCallback={updateFilteredChecks}
        />
      </div>
    </div>
  );
}

export const LabelFilterList = ({ labels }) => {
  const [list, setList] = useState({});
  useEffect(() => {
    if (labels) {
      const [bl, nbl] = separateLabelsByBooleanType(Object.values(labels));
      const groupedNbl = groupLabelsByKey(nbl);
      const keyedBl = bl
        .map((o) => ({ ...o, isBoolean: true }))
        .reduce((acc, current) => {
          acc[current.key] = [current];
          return acc;
        }, {});

      const mergedLabels = { ...keyedBl, ...groupedNbl };
      setList(mergedLabels);
    }
  }, [labels]);
  return (
    <div>
      {Object.entries(list)
        .sort((a, b) => (a[0] > b[0] ? 1 : -1))
        .map(([labelKey, labels]) => (
          <div key={labelKey} className="mb-2">
            {labels.length > 1 ? (
              <>
                <div className="text-xs whitespace-nowrap overflow-ellipsis w-full overflow-hidden mb-1">
                  {labelKey}
                </div>
                <MultiSelectLabelsDropdownStandalone
                  labels={labels}
                  selectAllByDefault
                />
              </>
            ) : labels.length === 1 ? (
              <div className="flex w-full mb-3">
                <div className="mr-3 w-full text-xs text-left text-gray-700 break-all overflow-ellipsis overflow-x-hidden flex items-center">
                  {labels[0].key}
                </div>
                <TristateLabelStandalone
                  label={labels[0]}
                  className="flex items-center"
                  labelClass=""
                  hideLabel
                />
              </div>
            ) : null}
          </div>
        ))}
    </div>
  );
};

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

      setDropdownValue(selected);

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

export const TristateLabelStandalone = ({
  label,
  className,
  labelClass,
  ...rest
}) => {
  const { labels: urlLabelState = {} } = decodeUrlSearchParams(
    window.location.search
  );
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [toggleState, setToggleState] = useState(0);

  const handleToggleChange = (v) => {
    if (!isFirstLoad) {
      const { labels: urlLabelState } = decodeUrlSearchParams(
        window.location.search
      );
      const newState = { ...urlLabelState };
      newState[label.id] = v;
      const conciseLabelState = getConciseLabelState(newState);
      updateParams({ labels: conciseLabelState });
      setToggleState(v);
    }
  };

  // get initial state from URL
  useEffect(() => {
    const { labels: urlLabelState = {} } = decodeUrlSearchParams(
      window.location.search
    );
    if (Object.prototype.hasOwnProperty.call(urlLabelState, label.id)) {
      setToggleState(urlLabelState[label.id]);
    } else {
      setToggleState(0);
    }
  }, [label, urlLabelState]);

  useEffect(() => {
    setIsFirstLoad(false);
  }, []);

  return (
    <>
      <TristateToggle
        value={toggleState}
        onChange={(v) => handleToggleChange(v)}
        className={className}
        labelClass={labelClass}
        label={label}
        {...rest}
      />
    </>
  );
};

export const TristateLabels = ({ labels = [] }) => {
  const [labelStates, setLabelStates] = useState({});

  // first load or label change: set label states
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
  topHeight = 0,
  ...props
}) => (
  <div
    className={className || "flex flex-col w-100 border-r"}
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
