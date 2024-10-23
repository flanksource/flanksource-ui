import { OnChangeFn, PaginationState } from "@tanstack/react-table";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

const pageSizeAtom = atomWithStorage("pageSize", "50", undefined, {
  getOnInit: true
});

export default function useReactTablePaginationState() {
  const [pageSizeFromStorage, setPageSizeFromStorage] = useAtom(pageSizeAtom);

  const [params, setParams] = useSearchParams({
    pageIndex: "0",
    pageSize: pageSizeFromStorage ?? "50"
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
      setPageSizeFromStorage(updated.pageSize.toString());
    },
    [pageIndex, pageSize, params, setPageSizeFromStorage, setParams]
  );

  return {
    pageIndex,
    setPageIndex,
    pageSize
  };
}
