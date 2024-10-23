import { OnChangeFn, PaginationState } from "@tanstack/react-table";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

const persistPageSizeAtom = atomWithStorage(
  "persistPageSize",
  "50",
  undefined,
  {
    getOnInit: true
  }
);

export default function useReactTablePaginationState(
  persistToLocalStorage = true
) {
  const [pageSizeFromLocalStorage, setPageSize] = useAtom(persistPageSizeAtom);

  const [params, setParams] = useSearchParams({
    pageIndex: "0",
    pageSize: persistToLocalStorage ? pageSizeFromLocalStorage : "50"
  });

  const pageIndex = parseInt(params.get("pageIndex") ?? "0", 10);
  const pageSize = parseInt(params.get("pageSize") ?? "50", 10);

  const setPageIndex: OnChangeFn<PaginationState> = useCallback(
    (param) => {
      const updated =
        typeof param === "function"
          ? param({
              pageIndex: pageIndex ?? 0,
              pageSize: pageSize ?? 50
            })
          : param;
      params.set("pageIndex", updated.pageIndex.toString());
      params.set("pageSize", updated.pageSize.toString());
      setParams(params);
      if (persistToLocalStorage) {
        setPageSize(updated.pageSize.toString());
      }
    },
    [pageIndex, pageSize, params, persistToLocalStorage, setPageSize, setParams]
  );

  return {
    pageIndex,
    setPageIndex,
    pageSize
  };
}
