import dayjs from "dayjs";
import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
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
export default function useTimeRangeParams() {
  const [params, setParams] = useSearchParams();

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
        params.set("duration", range.durationInSeconds.toString());
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
        const duration = params.get("duration");
        if (duration) {
          return {
            type: rangeType,
            display: display as string,
            durationInSeconds: parseInt(duration)
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
      const duration = params.get("duration");
      if (duration) {
        return {
          from: dayjs().subtract(parseInt(duration), "seconds").toISOString(),
          to: dayjs().toISOString()
        };
      } else {
        throw new Error("Invalid relative time range");
      }
    }
    if (rangeType === "mapped") {
      const display = (params.get("timeRange") ?? "") as MappedOptionsDisplay;
      const timeRange = mappedOptionsTimeRanges.get(display);
      if (timeRange) {
        return timeRange();
      } else {
        throw new Error("Invalid mapped time range");
      }
    }
  }, [params]);

  return {
    setTimeRangeParams,
    timeRangeAbsoluteValue,
    getTimeRangeFromUrl
  };
}
