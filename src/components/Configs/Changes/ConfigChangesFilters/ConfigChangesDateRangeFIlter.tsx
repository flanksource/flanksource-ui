import { useConfigChangesViewToggleState } from "@flanksource-ui/components/Configs/Changes/ConfigChangesViewToggle";
import { TimeRangePicker } from "@flanksource-ui/ui/Dates/TimeRangePicker";
import { parseDateMath } from "@flanksource-ui/ui/Dates/TimeRangePicker/parseDateMath";
import useTimeRangeParams from "@flanksource-ui/ui/Dates/TimeRangePicker/useTimeRangeParams";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo } from "react";
import { URLSearchParamsInit } from "react-router-dom";
import {
  RangeOptionsCategory,
  TimeRangeOption,
  timeRangeOptionsToAbsolute
} from "@flanksource-ui/ui/Dates/TimeRangePicker/rangeOptions";

type Props = {
  paramsToReset?: string[];
  paramPrefix?: string;
};

export const configChangesDefaultDateFilter: URLSearchParamsInit = {
  rangeType: "relative",
  display: "2 days",
  range: "now-2d"
};

const configChangesGraphDefaultDateFilter = {
  type: "relative",
  display: "2 hours",
  range: "now-2h"
} satisfies TimeRangeOption;

const graphRangeOptionsCategories: RangeOptionsCategory[] = [
  {
    name: "Relative time ranges",
    type: "past",
    options: [
      { type: "relative", display: "5 minutes", range: "now-5m" },
      { type: "relative", display: "15 minutes", range: "now-15m" },
      { type: "relative", display: "30 minutes", range: "now-30m" },
      { type: "relative", display: "1 hour", range: "now-1h" },
      { type: "relative", display: "2 hours", range: "now-2h" },
      { type: "relative", display: "3 hours", range: "now-3h" },
      { type: "relative", display: "6 hours", range: "now-6h" },
      { type: "relative", display: "12 hours", range: "now-12h" },
      { type: "relative", display: "24 hours", range: "now-24h" },
      { type: "relative", display: "2 days", range: "now-2d" },
      { type: "relative", display: "7 days", range: "now-7d" }
    ]
  }
];

const MAX_GRAPH_RANGE_DAYS = 7;
const MAX_GRAPH_RANGE_MS = MAX_GRAPH_RANGE_DAYS * 24 * 60 * 60 * 1000;

const mappedRangesOverGraphLimit = new Set([
  "Previous month",
  "Previous year",
  "This month",
  "This month so far",
  "This year",
  "This year so far"
]);

function resolveDate(value: string, roundUp = false) {
  if (value === "now") {
    return dayjs();
  }
  if (value.startsWith("now")) {
    return dayjs(parseDateMath(value, roundUp));
  }
  return dayjs(value);
}

function isRangeOverGraphLimit(range?: TimeRangeOption) {
  if (!range) {
    return false;
  }
  if (
    range.type === "mapped" &&
    mappedRangesOverGraphLimit.has(range.display)
  ) {
    return true;
  }

  const { from, to } = timeRangeOptionsToAbsolute(range);
  const fromDate = resolveDate(from);
  const toDate = resolveDate(to, true);

  if (!fromDate.isValid() || !toDate.isValid()) {
    return false;
  }

  return toDate.diff(fromDate) > MAX_GRAPH_RANGE_MS;
}

export default function ConfigChangesDateRangeFilter({
  paramsToReset = [],
  paramPrefix
}: Props) {
  const view = useConfigChangesViewToggleState();
  const isGraphView = view === "Graph";
  const defaultDateFilter = useMemo(
    () =>
      isGraphView
        ? {
            rangeType: "relative",
            display: configChangesGraphDefaultDateFilter.display,
            range: configChangesGraphDefaultDateFilter.range
          }
        : configChangesDefaultDateFilter,
    [isGraphView]
  );
  const { setTimeRangeParams, getTimeRangeFromUrl } = useTimeRangeParams(
    defaultDateFilter,
    paramPrefix
  );

  const timeRangeValue = getTimeRangeFromUrl();

  const validateGraphTimeRange = useCallback(
    (timeRange: TimeRangeOption) => {
      if (isGraphView && isRangeOverGraphLimit(timeRange)) {
        return `Graph mode supports a maximum time range of ${MAX_GRAPH_RANGE_DAYS} days.`;
      }
    },
    [isGraphView]
  );

  const setValidTimeRangeParams = useCallback(
    (timeRange: TimeRangeOption) => {
      setTimeRangeParams(
        validateGraphTimeRange(timeRange)
          ? configChangesGraphDefaultDateFilter
          : timeRange,
        paramsToReset
      );
    },
    [paramsToReset, setTimeRangeParams, validateGraphTimeRange]
  );

  useEffect(() => {
    if (isGraphView && isRangeOverGraphLimit(timeRangeValue)) {
      setTimeRangeParams(configChangesGraphDefaultDateFilter, paramsToReset);
    }
  }, [isGraphView, paramsToReset, setTimeRangeParams, timeRangeValue]);

  return (
    <TimeRangePicker
      onChange={setValidTimeRangeParams}
      value={timeRangeValue}
      rangeOptionsCategories={
        isGraphView ? graphRangeOptionsCategories : undefined
      }
      validateRange={validateGraphTimeRange}
    />
  );
}
