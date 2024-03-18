import dayjs from "dayjs";
import { useCallback, useMemo } from "react";
import { URLSearchParamsInit, useSearchParams } from "react-router-dom";
import { parseDateMath } from "./parseDateMath";
import {
  MappedOptionsDisplay,
  TimeRangeOption,
  mappedOptionsTimeRanges
} from "./rangeOptions";

/**
 *
 * useTimeRangeParams
 *
 * This hook is used to manage the time range parameters in the URL. It provides
 * a way to set the time range parameters and get the time range as an absolute
 * range, which can be consumed directly. It uses the useSearchParams hook from
 * react-router-dom to manage the URL parameters.
 *
 */
export default function useTimeRangeParams(defaults?: URLSearchParamsInit) {
  const [params, setParams] = useSearchParams(defaults);

  const setTimeRangeParams = useCallback(
    (range: TimeRangeOption) => {
      params.set("rangeType", range.type);
      params.set("display", range.display);

      // remove the old time range parameters
      params.delete("from");
      params.delete("to");
      params.delete("duration");
      params.delete("timeRange");

      // set the new time range parameters
      if (range.type === "absolute") {
        params.set("from", range.from);
        params.set("to", range.to);
      }
      if (range.type === "relative") {
        params.set("range", range.range.toString());
      }
      if (range.type === "mapped") {
        params.set("timeRange", range.display);
      }
      setParams(params);
    },
    [params, setParams]
  );

  const getTimeRangeFromUrl: () => TimeRangeOption | undefined =
    useCallback(() => {
      const rangeType = params.get("rangeType");
      const display = params.get("display");
      if (rangeType === "absolute") {
        const from = params.get("from");
        const to = params.get("to");
        return {
          type: rangeType,
          display: "Custom",
          from: from as string,
          to: to as string
        } satisfies TimeRangeOption;
      }
      if (rangeType === "relative") {
        const range = params.get("range");
        if (range) {
          return {
            type: rangeType,
            display: display as string,
            range: range?.toString()!
          } satisfies TimeRangeOption;
        }
      }
      if (rangeType === "mapped") {
        return {
          type: rangeType,
          display: display as MappedOptionsDisplay
        };
      }
      return undefined;
    }, [params]);

  /**
   *
   * filterDateMath
   *
   * This will return the time range in the url as a date math expression (or as
   * stored within the URL). This just a helper that makes it easier to consume
   * the time range from the URL.
   *
   */
  const timeRangeValue = useMemo(() => {
    const rangeType = params.get("rangeType");
    if (rangeType === "absolute") {
      const from = params.get("from")
        ? dayjs(params.get("from") as string).toISOString()
        : undefined;
      const to = params.get("to")
        ? dayjs(params.get("to") as string).toISOString()
        : undefined;
      return { from, to };
    }
    if (rangeType === "relative") {
      const range = params.get("range");
      if (range) {
        return {
          from: range,
          to: "now"
        };
      }
    }
    if (rangeType === "mapped") {
      const display = (params.get("timeRange") ?? "") as MappedOptionsDisplay;
      const timeRange = mappedOptionsTimeRanges.get(display);
      if (timeRange) {
        return timeRange();
      } else {
        console.error("Invalid mapped time range");
      }
    }
  }, [params]);

  /**
   *
   * useTimeRangeParams
   *
   * We are using datemath expressions to represent the time range in the URL.
   * This isn't supported by some backends, specifically anything involving db
   * queries, so we need to convert the datemath expressions to ISO strings.
   *
   */
  const timeRangeAbsoluteValue = useMemo(() => {
    const rangeType = params.get("rangeType");
    if (rangeType === "absolute") {
      const from = params.get("from")
        ? dayjs(params.get("from") as string).toISOString()
        : undefined;
      const to = params.get("to")
        ? dayjs(params.get("to") as string).toISOString()
        : undefined;
      return { from, to };
    }
    if (rangeType === "relative") {
      const range = params.get("range");
      if (range) {
        return {
          // convert datemath to ISO string for absolute time range
          from: parseDateMath(range, false),
          to: dayjs().utc().toISOString()
        };
      } else {
        console.error("Invalid relative time range");
      }
    }
    if (rangeType === "mapped") {
      const display = (params.get("timeRange") ?? "") as MappedOptionsDisplay;
      const timeRange = mappedOptionsTimeRanges.get(display)?.();
      if (timeRange) {
        // datemath should be converted to ISO string
        return {
          from: parseDateMath(timeRange.from, false),
          to: parseDateMath(timeRange.to, false)
        };
      } else {
        throw new Error("Invalid mapped time range");
      }
    }
  }, [params]);

  return {
    setTimeRangeParams,
    timeRangeAbsoluteValue,
    getTimeRangeFromUrl,
    timeRangeValue
  };
}
