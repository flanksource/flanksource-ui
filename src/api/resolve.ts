import { AxiosPromise } from "axios";

export type ApiResp<T = any> = Promise<
  | {
      error: Error;
      data: null;
      totalEntries: undefined;
    }
  | {
      data: T;
      totalEntries?: number;
      error: null;
    }
>;

/**
 *
 * Takes a response from postgrest and extracts the pagination information from
 * headers and adds it to the response object.
 *
 * https://docs.postgrest.org/en/v12/references/api/pagination_count.html
 *
 */
export const resolvePostGrestRequestWithPagination: <T>(
  promise: AxiosPromise<T>
) => ApiResp<T> = async (promise) => {
  try {
    const { data, headers } = await promise;
    const hasContentRangeHeader = !!headers["content-range"]?.trim();
    const totalEntries = hasContentRangeHeader
      ? +headers["content-range"].split("/")[1]
      : undefined;
    return { data, error: null, totalEntries };
  } catch (error: any) {
    if (error instanceof Error) {
      return { error, data: null };
    } else {
      return {
        error: Error("Unknown error happened while fetching."),
        data: null
      };
    }
  }
};
