import { AxiosResponse } from "axios";

export type ApiResp<T = any> = Promise<{
  data?: T;
  error?: any;
}>;

export const resolve: <T>(
  promise: Promise<AxiosResponse<T>>
) => ApiResp<T> = async (promise) => {
  try {
    const { data } = await promise;
    return { data };
  } catch (error) {
    return { error };
  }
};
