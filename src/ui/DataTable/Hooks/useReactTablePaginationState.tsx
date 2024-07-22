import { OnChangeFn, PaginationState } from "@tanstack/react-table";
import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

export default function useReactTablePaginationState() {
  const [params, setParams] = useSearchParams({
    pageIndex: "0",
    pageSize: "50"
  });

  const pageIndex = parseInt(params.get("pageIndex") ?? "0", 10);
  const pageSize = parseInt(params.get("pageSize") ?? "50", 10);

  const setPageIndex: OnChangeFn<PaginationState> = useCallback(
    (param) => {
      const updated =
        typeof param === "function"
          ? param({
              pageIndex: pageIndex,
              pageSize: pageSize
            })
          : param;
      params.set("pageIndex", updated.pageIndex.toString());
      params.set("pageSize", updated.pageSize.toString());
      setParams(params);
    },
    [pageIndex, pageSize, params, setParams]
  );

  return {
    pageIndex,
    setPageIndex,
    pageSize
  };
}
