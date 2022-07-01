import { AxiosPromise } from "axios";

export type ApiResp<T = any> = Promise<
  | {
      error: Error;
      data: null;
    }
  | {
      data: T;
      error: null;
    }
>;

export const resolve: <T>(promise: AxiosPromise<T>) => ApiResp<T> = async (
  promise
) => {
  try {
    const { data } = await promise;
    return { data, error: null };
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
