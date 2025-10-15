import { isAxiosError } from "axios";

/**
 * HTTPError represents the error response structure from the backend API.
 */
export type HTTPError = {
  /** Primary error message */
  error: string;
  /** Optional human-readable message with additional context */
  message?: string;
  /** Optional data for machine-machine communication, usually contains JSON */
  data?: string;
};

/**
 * OopsError represents the detailed error response structure from the backend
 * using the oops library.
 */
export type OopsError = {
  /** Error message */
  error: string;
  /** Error code */
  code?: string;
  /** User-facing public message - use this for display when available */
  public?: string;
  /** Helpful hint for resolving the error */
  hint?: string;
  /** Optional message with additional context */
  message?: string;
  /** Timestamp of when error occurred */
  time?: string;
  /** Duration of the operation that failed */
  duration?: string;
  /** Domain/module where error occurred */
  domain?: string;
  /** Tags associated with the error */
  tags?: string[];
  /** Additional context data */
  context?: any;
  /** Stack trace */
  stacktrace?: string;
  /** Trace ID for distributed tracing */
  trace?: string;
  /** Source code fragments */
  sources?: string;
  /** Owner of the resource that caused the error */
  owner?: string;
  /** HTTP request dump */
  request?: string;
  /** HTTP response dump */
  response?: string;
  /** User information */
  user?: { id?: string; [key: string]: any };
};

/**
 * Extracts a user-friendly error message from an error object.
 * Handles AxiosError with HTTPError or OopsError response data.
 */
export function getErrorMessage(error: unknown): string {
  if (!error) {
    return "";
  }

  if (isAxiosError<HTTPError | OopsError>(error)) {
    const data = error.response?.data;

    if (data) {
      const oopsData = data as OopsError;
      if (
        oopsData.public ||
        oopsData.code ||
        oopsData.context ||
        oopsData.stacktrace
      ) {
        return (
          oopsData.public ||
          oopsData.hint ||
          oopsData.message ||
          oopsData.error ||
          "Unknown error"
        );
      }

      // Otherwise treat response.data as HTTPError or basic OopsError
      return data.message || data.error || error.message || "Unknown error";
    }

    return error.message || "Unknown error";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown error";
}
