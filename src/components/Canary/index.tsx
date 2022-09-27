import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { debounce } from "lodash";

import { Toggle } from "../Toggle";
import { Loading } from "../Loading";
import { StatCard } from "../StatCard";
import { TristateToggle } from "../TristateToggle";
import { LabelFilterDropdown } from "./FilterForm";
import { CanarySearchBar } from "./CanarySearchBar";
import { getStartValue } from "./CanaryStatusChart";
import { TabByDropdown } from "../Dropdown/TabByDropdown";
import { GroupByDropdown } from "../Dropdown/GroupByDropdown";
import { TimeRange, timeRanges } from "../Dropdown/TimeRange";
import { CanaryInterfaceMinimal } from "../CanaryInterface/minimal";
import { DropdownStandaloneWrapper } from "../Dropdown/StandaloneWrapper";

import { isHealthy } from "./filter";
import { getParamsFromURL } from "./utils";
import { defaultTabSelections } from "../Dropdown/lib/lists";
import { useHealthPageContext } from "../../context/HealthPageContext";
import {
  groupLabelsByKey,
  getConciseLabelState,
  separateLabelsByBooleanType
} from "./labels";
import {
  useUpdateParams,
  decodeUrlSearchParams,
  encodeObjectToUrlSearchParams,
} from "./url";

import mixins from "../../utils/mixins.module.css";

const FilterKeyToLabelMap = {
  environment: "Environment",
  severity: "Severity",
  technology: "Technology",
  app: "App",
  "Expected-Fail": "Expected Fail"
};

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
  url = "/api/canary/api",
  refreshInterval = 15 * 1000,
  topLayoutOffset = 0,
  hideSearch,
  hideTimeRange,
  onLoading = (_loading) => {}
}) {
  const updateParams = useUpdateParams();
  // force-set layout to table
  useEffect(() => {
    updateParams({ layout: "table" });
  }, []);

  const [isLoading, setIsLoading] = useState(true);
  const [_, setLastUpdated] = useState("");
  const {
    healthState: { checks, filteredChecks, filteredLabels, passing },
    setHealthState
  } = useHealthPageContext();
  const [timerRef, setTimerRef] = useState();
  const [abortController] = useState(() => {
    return new AbortController();
  });

  const labelUpdateCallback = useCallback((newLabels) => {
    setHealthState((state) => {
      return {
        ...state,
        filteredLabels: newLabels
      };
    });
  }, []);

  useEffect(() => {
    setHealthState((state) => {
      return {
        ...state,
        passing: {
          ...state.passing,
          checks: getPassingCount(checks)
        }
      };
    });
  }, [checks]);

  useEffect(() => {
    setHealthState((state) => {
      return {
        ...state,
        passing: {
          ...state.passing,
          filtered: getPassingCount(filteredChecks)
        }
      };
    });
  }, [filteredChecks]);

  const updateFilteredChecks = useCallback((newFilteredChecks) => {
    setHealthState((state) => {
      return {
        ...state,
        filteredChecks: newFilteredChecks || []
      };
    });
  }, []);

  const [searchParams] = useSearchParams();

  const handleFetch = debounce(async () => {
    if (url == null) {
      return;
    }
    clearTimeout(timerRef);
    const params = encodeObjectToUrlSearchParams({
      start: getStartValue(searchParams.get("timeRange") ?? "1h")
    });
    setIsLoading(true);
    onLoading(true);
    try {
      const result = await fetch(`${url}?${params}`, {
        signal: abortController.signal
      });
      const data = await result.json();
      setHealthState((state) => {
        return {
          ...state,
          checks: data?.checks || []
        };
      });
      if (data?.checks?.length) {
        setLastUpdated(new Date());
      }
    } catch (ex) {
      if (ex instanceof DOMException && ex.name === "AbortError") {
        return;
      }
    }
    setIsLoading(false);
    onLoading(false);
    const ref = setTimeout(handleFetch, refreshInterval);
    setTimerRef(ref);
  }, 1000);

  useEffect(() => {
    handleFetch();
  }, [refreshInterval]);

  useEffect(() => {
    return () => {
      clearTimeout(timerRef);
      abortController.abort();
    };
  }, []);

  const handleSearch = debounce((value) => {
    updateParams({ query: value });
  }, 400);

  if (isLoading && !checks.length) {
    return <Loading className="mt-16" text="Please wait, Loading ..." />;
  }

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
                  <span className="text-xl font-light">
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
        <div className="flex items-center mb-6">
          <div className="flex items-center h-9">
            <HidePassingToggle />
          </div>
          <div className="mb-0 text-sm text-gray-800">Hide Passing</div>
        </div>
        <SectionTitle className="flex items-center justify-between mb-5">
          Filter by Label{" "}
          {/* <button
              type="button"
              onClick={() => {
                updateParams({ labels: {} });
              }}
              className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-200 rounded-md"
            >
              Clear All
            </button> */}
        </SectionTitle>
        <div className="w-full mb-4 mr-2">
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
              defaultValue={searchParams?.query}
            />
          </div>
        )}

        <div className="flex flex-wrap mb-2">
          <div className="mb-2 mr-2">
            <DropdownStandaloneWrapper
              dropdownElem={<GroupByDropdown />}
              checks={checks}
              defaultValue="canary_name"
              paramKey="groupBy"
              className="w-64"
              prefix={
                <div className="mr-2 text-xs text-gray-500 whitespace-nowrap">
                  Group By:
                </div>
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
                <div className="mr-2 text-xs text-gray-500 whitespace-nowrap">
                  Tab By:
                </div>
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
                <div className="mr-2 text-xs text-gray-500 whitespace-nowrap">
                  Time Range:
                </div>
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
                <div className="w-full mb-1 overflow-hidden text-xs whitespace-nowrap overflow-ellipsis">
                  {FilterKeyToLabelMap[labelKey] || labelKey}
                </div>
                <MultiSelectLabelsDropdownStandalone
                  labels={labels}
                  selectAllByDefault
                />
              </>
            ) : labels.length === 1 ? (
              <div className="flex w-full mb-3">
                <div className="flex items-center w-full mr-3 overflow-x-hidden text-xs text-left text-gray-700 break-all overflow-ellipsis">
                  {FilterKeyToLabelMap[labels[0].key] || labels[0].key}
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
  const updateParams = useUpdateParams();

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
  const updateParams = useUpdateParams();
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
  const updateParams = useUpdateParams();

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
    <TristateToggle
      value={toggleState}
      onChange={(v) => handleToggleChange(v)}
      className={className}
      labelClass={labelClass}
      label={label}
      {...rest}
    />
  );
};

export const TristateLabels = ({ labels = [] }) => {
  const [labelStates, setLabelStates] = useState({});
  const updateParams = useUpdateParams();

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
              className="flex items-center mb-2"
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
    className={`uppercase font-semibold text-sm mb-3 text-blue-700 ${className}`}
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
