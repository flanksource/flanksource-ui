import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

/**
 *
 * useGroupBySearchParam is a custom hook that returns the groupBy search parameter
 * as an array of strings.
 *
 */
export default function useGroupBySearchParam(): string[] | undefined {
  const [searchParams] = useSearchParams({
    groupBy: "config_class,type"
  });

  const groupByProp = searchParams.get("groupBy") ?? undefined;

  return useMemo(() => {
    if (groupByProp) {
      return groupByProp.split(",").map((group) => {
        return group.replace("__tag", "");
      });
    }
    return undefined;
  }, [groupByProp]);
}
