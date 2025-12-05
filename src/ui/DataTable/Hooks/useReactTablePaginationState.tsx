import { OnChangeFn, PaginationState } from "@tanstack/react-table";
import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

type PaginationOptions = {
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
  options: PaginationOptions = {}
) {
  const {
    paramPrefix,
    pageIndexKey = "pageIndex",
    pageSizeKey = "pageSize",
    defaultPageSize = 50
  } = options;

  const pageIndexParamKey = paramPrefix
    ? `${paramPrefix}__${pageIndexKey}`
    : pageIndexKey;
  const pageSizeParamKey = paramPrefix
    ? `${paramPrefix}__${pageSizeKey}`
    : pageSizeKey;

  const defaultPageSizeValue = defaultPageSize.toString();

  const [params, setParams] = useSearchParams({
    [pageIndexParamKey]: "0",
    [pageSizeParamKey]: defaultPageSizeValue
  });

  const pageIndex = parseInt(params.get(pageIndexParamKey) ?? "0", 10);
  const pageSize = parseInt(
    params.get(pageSizeParamKey) ?? defaultPageSizeValue,
    10
  );

  const setPageIndex: OnChangeFn<PaginationState> = useCallback(
    (param) => {
      const updated =
        typeof param === "function"
          ? param({
              pageIndex: pageIndex ?? 0,
              pageSize: pageSize ?? 50
            })
          : param;
      const newParams = new URLSearchParams(params);
      newParams.set(pageIndexParamKey, updated.pageIndex.toString());
      newParams.set(pageSizeParamKey, updated.pageSize.toString());
      setParams(newParams);
    },
    [
      pageIndex,
      pageSize,
      params,
      setParams,
      pageIndexParamKey,
      pageSizeParamKey
    ]
  );

  return {
    pageIndex,
    setPageIndex,
    pageSize
  };
}
