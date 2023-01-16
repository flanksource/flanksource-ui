import { useCallback } from "react";
import {
  useSearchParams,
  URLSearchParamsInit,
  NavigateOptions
} from "react-router-dom";

/**
 *
 * usePartialUpdateSearchParams
 *
 * This hook is used to update the search params in the URL without replacing
 * the entire URL and also avoids unnecessary updates to the URL i.e. only updates
 * if the value has changed.
 *
 * This wraps useSearchParams and returns the same value as useSearchParams
 *
 * @param init
 * @returns
 */
export function usePartialUpdateSearchParams(
  init?: URLSearchParamsInit
): [
  URLSearchParams,
  (
    newParams: Record<string, string | string[]>,
    navigationOptions?: NavigateOptions
  ) => void
] {
  const [params, setParams] = useSearchParams(init);

  const setPartialParams = useCallback(
    (
      newParams: Record<string, string | string[]>,
      navigationOptions: NavigateOptions = {
        replace: true
      }
    ) => {
      let paramsChanged = false;
      Object.entries(newParams).forEach(([key, value]) => {
        // remove the key if the value is falsy
        if (!value || value.length === 0) {
          // if the key doesn't exist, don't update the URL
          if (params.has(key)) {
            params.delete(key);
            paramsChanged = true;
          }
          return;
        }
        // if the value hasn't changed, don't update the URL
        if (Array.isArray(value)) {
          params.delete(key);
          // loop through the new values and see if any of them are different
          if (value.filter((x) => !params.getAll(key).includes(x)).length > 0) {
            value.forEach((v) => {
              paramsChanged = true;
              params.append(key, v);
            });
          }
        } else {
          if (params.get(key) !== value) {
            paramsChanged = true;
            params.set(key, value);
          }
        }
      });
      if (paramsChanged) {
        setParams(params, navigationOptions);
      }
    },
    [params, setParams]
  );

  return [params, setPartialParams];
}
