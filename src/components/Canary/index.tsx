import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { debounce } from "lodash";
import { useUpdateParams, decodeUrlSearchParams } from "./url";
import { CanarySearchBar } from "./CanarySearchBar";
import { CanaryInterfaceMinimal } from "../CanaryInterface/minimal";
import { GroupByDropdown } from "../Dropdown/GroupByDropdown";
import {
  DropdownStandaloneWrapper,
  DropdownStandaloneWrapperProps
} from "../Dropdown/StandaloneWrapper";
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
import { useHealthPageContext } from "../../context/HealthPageContext";
import { isCanaryUI } from "../../context/Environment";
import clsx from "clsx";
import HealthPageSkeletonLoader from "../SkeletonLoader/HealthPageSkeletonLoader";
import { HealthChecksResponse } from "../../types/healthChecks";
import { useLocation, useSearchParams } from "react-router-dom";
import useRefreshRateFromLocalStorage from "../Hooks/useRefreshRateFromLocalStorage";
import { HEALTH_SETTINGS } from "../../constants";

const FilterKeyToLabelMap = {
  environment: "Environment",
  severity: "Severity",
  technology: "Technology",
  app: "App",
  "Expected-Fail": "Expected Fail"
};

const getPassingCount = (checks: any) => {
  let count = 0;
  checks.forEach((check: any) => {
    if (isHealthy(check)) {
      count += 1;
    }
  });
  return count;
};

type CanaryProps = {
  url?: string;
  topLayoutOffset?: number;
  onLoading?: (loading: boolean) => void;
  /**
   * When this changes, refresh button has been clicked will be triggered immediately
   */
  triggerRefresh?: number;
};

export function Canary({
  url = "/api/canary/api/summary",
  topLayoutOffset = 65,
  triggerRefresh,
  onLoading = (_loading) => {}
}: CanaryProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const timeRange = searchParams.get("timeRange");
  const hidePassing = searchParams.get("hidePassing");
  const tabBy = searchParams.get("tabBy");
  const groupBy = searchParams.get("groupBy");
  const refreshInterval = useRefreshRateFromLocalStorage();

  const [isLoading, setIsLoading] = useState(true);

  const {
    healthState: { checks, filteredChecks, filteredLabels, passing },
    setHealthState
  } = useHealthPageContext();

  const timerRef = useRef<NodeJS.Timer>();
  const abortController = useRef<AbortController>();

  const labelUpdateCallback = useCallback(
    (newLabels: any) => {
      setHealthState((state) => {
        return {
          ...state,
          filteredLabels: newLabels
        };
      });
    },
    [setHealthState]
  );

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
  }, [checks, setHealthState]);

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
  }, [filteredChecks, setHealthState]);

  const updateFilteredChecks = useCallback(
    (newFilteredChecks: any[]) => {
      setHealthState((state) => {
        return {
          ...state,
          filteredChecks: newFilteredChecks || []
        };
      });
    },
    [setHealthState]
  );

  const handleFetch = useCallback(async () => {
    if (url == null) {
      return;
    }
    setIsLoading(true);
    onLoading(true);
    if (abortController.current) {
      abortController.current.abort();
    }
    const controller = new AbortController();
    abortController.current = controller;
    try {
      const result = await fetch(url, {
        signal: abortController.current?.signal
      });
      const data = (await result.json()) as HealthChecksResponse;
      setHealthState((state) => {
        return {
          ...state,
          checks: data?.checks_summary || []
        };
      });
    } catch (ex) {
      if (ex instanceof DOMException && ex.name === "AbortError") {
        return;
      }
    }
    setIsLoading(false);
    onLoading(false);
  }, [onLoading, setHealthState, url]);

  // Set refresh interval for re-fetching data
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (refreshInterval > 0) {
      timerRef.current = setInterval(() => handleFetch(), refreshInterval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshInterval]);

  useEffect(() => {
    handleFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange, triggerRefresh, url]);

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
      abortController.current?.abort();
    };
  }, []);

  useEffect(() => {
    const settings = localStorage.getItem(HEALTH_SETTINGS);
    const parsedSettings = JSON.parse(settings ?? "{}");

    localStorage.setItem(
      HEALTH_SETTINGS,
      JSON.stringify({
        groupBy: groupBy ?? parsedSettings?.groupBy,
        tabBy: tabBy ?? parsedSettings?.tabBy,
        hidePassing: hidePassing ?? parsedSettings?.hidePassing
      })
    );
  }, [groupBy, tabBy, hidePassing]);

  const handleSearch = debounce((value) => {
    searchParams.set("query", value);
    setSearchParams(searchParams);
  }, 400);

  if (isLoading && !checks?.length) {
    return <HealthPageSkeletonLoader showSidebar />;
  }

  const filteredChecksLength = filteredChecks.length;
  const isFilterApplied = filteredChecksLength !== checks?.length;

  return (
    <div
      className={clsx(
        "flex flex-row place-content-center w-full",
        isCanaryUI ? " h-screen overflow-y-auto" : ""
      )}
    >
      <SidebarSticky topHeight={topLayoutOffset}>
        <div className="mb-4">
          <StatCard
            title="All Checks"
            className="mb-4"
            customValue={
              <>
                {checks?.length || 0}
                <span className="text-xl font-light">
                  {" "}
                  (<span className="text-green-500">{passing.checks}</span>/
                  <span className="text-red-500">
                    {" "}
                    {checks!.length - passing.checks}
                  </span>
                  )
                </span>
              </>
            }
          />

          <StatCard
            title="Filtered Checks"
            className="mb-4"
            customValue={
              <>
                {isFilterApplied ? filteredChecksLength : 0}
                <span className="text-xl  font-light">
                  {" "}
                  (
                  <span className="text-green-500">
                    {isFilterApplied ? passing.filtered : 0}
                  </span>
                  /
                  <span className="text-red-500">
                    {isFilterApplied
                      ? filteredChecksLength - passing.filtered
                      : 0}
                  </span>
                  )
                </span>
              </>
            }
          />
        </div>
        <SectionTitle className="mb-4 hidden">
          Filter by Time Range
        </SectionTitle>
        <div className="mb-4 mr-2 w-full hidden">
          <TimeRange
            name="time-range"
            value={timeRange || timeRanges[1].value}
            className="w-full"
            dropDownClassNames="w-full"
            onChange={(value) => {
              if (value) {
                searchParams.set("timeRange", value);
                setSearchParams(searchParams, {
                  replace: true
                });
              }
            }}
          />
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

      <div className="flex-grow p-6 2xl:max-w-7xl max-w-[calc(100%-13rem)] xl:max-w-[calc(100%-15rem)]">
        <div className="flex flex-wrap mb-2">
          <div className="xl:flex-1 xl:mb-0 mb-4 mr-2">
            <CanarySearchBar
              onChange={(e) => handleSearch(e.target.value)}
              onSubmit={(value) => handleSearch(value)}
              onClear={() => handleSearch("")}
              style={{ maxWidth: "480px", width: "100%" }}
              inputClassName="w-full py-2 mr-2 mb-px"
              inputOuterClassName="w-full"
              placeholder="Search by name, description, or endpoint"
              defaultValue={searchParams.get("query") ?? ""}
            />
          </div>
          <div className="xl:flex-1 flex xl:justify-start lg:justify-end lg:flex-nowrap flex-wrap">
            <div className="mb-2 mr-2">
              <DropdownWrapper
                dropdownElem={<GroupByDropdown name="groupBy" />}
                name="groupBy"
                checks={checks ?? []}
                defaultValue="canary_name"
                paramKey="groupBy"
                className="w-64"
                prefix={
                  <div className="text-xs text-gray-500 mr-2 whitespace-nowrap">
                    Group By:
                  </div>
                }
              />
            </div>
            <div className="mb-2 mr-2">
              <DropdownWrapper
                dropdownElem={<TabByDropdown name="tabBy" />}
                defaultValue={defaultTabSelections.namespace.value}
                name="tabBy"
                paramKey="tabBy"
                checks={checks ?? []}
                className="w-64"
                prefix={
                  <div className="text-xs text-gray-500 mr-2 whitespace-nowrap">
                    Tab By:
                  </div>
                }
              />
            </div>
          </div>
        </div>
        <div className="pb-4">
          <CanaryInterfaceMinimal
            checks={checks ?? undefined}
            onLabelFiltersCallback={labelUpdateCallback}
            onFilterCallback={updateFilteredChecks}
          />
        </div>
      </div>
    </div>
  );
}

export const LabelFilterList = ({ labels }: { labels: any }) => {
  const [list, setList] = useState<Record<any, any>>({});

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
        .sort((a, b) => (a[0].toLowerCase() > b[0].toLowerCase() ? 1 : -1))
        .map(([labelKey, labels]) => (
          <div key={labelKey} className="mb-2">
            {labels.length > 1 ? (
              <>
                <div className="text-xs whitespace-nowrap overflow-ellipsis w-full overflow-hidden mb-1 capitalize">
                  {FilterKeyToLabelMap[
                    labelKey as keyof typeof FilterKeyToLabelMap
                  ] || labelKey}
                </div>
                <MultiSelectLabelsDropdownStandalone labels={labels} />
              </>
            ) : labels.length === 1 ? (
              <div className="flex w-full mb-3">
                <div className="mr-3 w-full text-xs text-left text-gray-700 break-all overflow-ellipsis overflow-x-hidden flex items-center capitalize">
                  {FilterKeyToLabelMap[
                    labels[0].key as keyof typeof FilterKeyToLabelMap
                  ] || labels[0].key}
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

const DropdownWrapper = ({
  defaultValue,
  dropdownElem,
  paramKey,
  ...rest
}: DropdownStandaloneWrapperProps) => {
  const updateParams = useUpdateParams();
  const settings = localStorage.getItem(HEALTH_SETTINGS);
  const value = JSON.parse(settings ?? "{}")[paramKey] ?? null;

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
};

export const HidePassingToggle = ({ defaultValue = false }) => {
  const settings: any = localStorage.getItem(HEALTH_SETTINGS);
  const hidePassing = JSON.parse(settings ?? "{}")?.hidePassing ?? null;
  const paramsValue = hidePassing ? hidePassing === "true" : null;

  const [value, setValue] = useState(paramsValue ?? defaultValue);
  const updateParams = useUpdateParams();

  useEffect(() => {
    updateParams({ hidePassing: value });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Toggle
      value={value}
      onChange={(val: boolean) => {
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
};

type TristateLabelStandaloneProps = {
  label: any;
  className?: string;
  labelClass?: string;
  hideLabel?: boolean;
};

export const TristateLabelStandalone = ({
  label,
  className,
  labelClass,
  ...props
}: TristateLabelStandaloneProps) => {
  const location = useLocation();

  const { labels: urlLabelState = {} } = useMemo(() => {
    return decodeUrlSearchParams(location.search);
  }, [location.search]);

  const updateParams = useUpdateParams();

  const handleToggleChange = (v: any) => {
    const newState = { ...urlLabelState };
    newState[label.id] = v;
    const conciseLabelState = getConciseLabelState(newState);
    updateParams({ labels: conciseLabelState });
  };

  return (
    <TristateToggle
      value={urlLabelState[label.id]}
      onChange={(v: string | number) => handleToggleChange(v)}
      className={className}
      labelClass={labelClass}
      label={label}
      {...props}
    />
  );
};

export const TristateLabels = ({ labels = [] }: { labels: any[] }) => {
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
          // @ts-expect-error
          acc[k] = v;
        }
        return acc;
      },
      {}
    );
    setLabelStates(newLabelStates);
  }, [labels]);

  const handleToggleChange = (labelKey: string, value: string) => {
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
                  ? // @ts-expect-error
                    labelStates[label.id]
                  : 0
              }
              onChange={(v: string) => handleToggleChange(label.id, v)}
              className="mb-2 flex items-center"
              labelClass="ml-3 text-xs text-left text-gray-700 break-all overflow-ellipsis overflow-x-hidden"
              label={label}
            />
          </div>
        ))}
    </div>
  );
};

function SectionTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`uppercase font-semibold text-sm mb-3 text-blue-700 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

type SidebarStickyProps = {
  className?: string;
  style?: React.CSSProperties;
  topHeight?: number;
  children?: React.ReactNode;
};

function SidebarSticky({
  className,
  style,
  children,
  topHeight = 0,
  ...props
}: SidebarStickyProps) {
  const topHeightPx = `${isCanaryUI ? 0 : topHeight}px`;
  return (
    <div
      className={className || "flex flex-col w-52 xl:w-60 2xl:w-80 border-r"}
      style={style || { minHeight: `calc(100vh -  ${topHeightPx})` }}
      {...props}
    >
      <div
        className={`h-full overflow-y-auto w-52 xl:w-60 2xl:w-80 overflow-x-hidden p-4 ${mixins.appleScrollbar}`}
        style={{
          position: "fixed",
          top: `${topHeightPx}`,
          maxHeight: `calc(100vh - ${topHeightPx})`
        }}
      >
        {children}
      </div>
    </div>
  );
}
