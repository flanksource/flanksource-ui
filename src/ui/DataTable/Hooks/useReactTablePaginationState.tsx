import { OnChangeFn, PaginationState } from "@tanstack/react-table";
import { useCallback } from "react";

import { usePrefixedSearchParams } from "../../../hooks/usePrefixedSearchParams";

type PaginationStateOptions = {
  /**
   * Optional prefix to namespace the search params (e.g. view specific tables).
   */
  paramPrefix?: string;

  /**
   * Custom key name for page index in search params. Defaults to "pageIndex".
   */
  pageIndexKey?: string;

  /**
   * Custom key name for page size in search params. Defaults to "pageSize".
   */
  pageSizeKey?: string;

  /**
   * Default page size to use when no query param is present. Defaults to 50.
   */
  defaultPageSize?: number;
};

export default function useReactTablePaginationState(
  options: PaginationStateOptions = {}
) {
  const {
    paramPrefix,
    pageIndexKey = "pageIndex",
    pageSizeKey = "pageSize",
    defaultPageSize = 50
  } = options;

  const defaultPageSizeValue = defaultPageSize.toString();

  const [params, setParams] = usePrefixedSearchParams(paramPrefix, false, {
    [pageIndexKey]: "0",
    [pageSizeKey]: defaultPageSizeValue
  });

  const pageIndex = parseInt(params.get(pageIndexKey) ?? "0", 10);
  const pageSize = parseInt(
    params.get(pageSizeKey) ?? defaultPageSizeValue,
    10
  );

  const setPageIndex: OnChangeFn<PaginationState> = useCallback(
    (param) => {
      setParams((current) => {
        const currentPageIndex = parseInt(current.get(pageIndexKey) ?? "0", 10);
        const currentPageSize = parseInt(
          current.get(pageSizeKey) ?? defaultPageSizeValue,
          10
        );

        const updated =
          typeof param === "function"
            ? param({
                pageIndex: currentPageIndex,
                pageSize: currentPageSize
              })
            : param;

        const next = new URLSearchParams(current);
        next.set(pageIndexKey, updated.pageIndex.toString());
        next.set(pageSizeKey, updated.pageSize.toString());
        return next;
      });
    },
    [defaultPageSizeValue, pageIndexKey, pageSizeKey, setParams]
  );

  return {
    pageIndex,
    setPageIndex,
    pageSize
  };
}
