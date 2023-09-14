export enum Size {
  small = "small",
  medium = "medium",
  large = "large",
  extra_large = "extra_large"
}

export enum ViewType {
  summary = "summary",
  detailed = "detailed"
}

export type AxiosResponseWithTotalEntries<T = unknown> =
  | { error: Error; data: null; totalEntries: undefined }
  | {
      data: T | null;
      totalEntries?: number | undefined;
      error: null;
    };
