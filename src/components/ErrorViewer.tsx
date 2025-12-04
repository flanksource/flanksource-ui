import { isAxiosError } from "axios";
import clsx from "clsx";
import { useMemo, useState } from "react";

type NormalizedError = {
  message: string;
  raw?: string;
};

const stringifyObject = (value: Record<string, any>) => {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
};

const normalizeError = (error: unknown): NormalizedError | null => {
  if (!error) return null;

  if (isAxiosError(error)) {
    const data = error.response?.data;
    const normalizedData = normalizeError(data);
    if (normalizedData) {
      const status =
        error.response?.status != null
          ? ` (HTTP ${error.response.status}${error.response.statusText ? ` ${error.response.statusText}` : ""})`
          : "";
      return {
        message: `${normalizedData.message}${status}`,
        raw:
          normalizedData.raw ??
          (data && typeof data === "object"
            ? stringifyObject(data as Record<string, any>)
            : typeof data === "string"
              ? data
              : undefined)
      };
    }
    return { message: error.message || "Request failed" };
  }

  if (typeof error === "string") {
    return { message: error, raw: error };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      raw: error.stack
    };
  }

  if (typeof error === "object") {
    const value = error as Record<string, any>;
    const message =
      value.error ||
      value.message ||
      value.detail ||
      value.msg ||
      stringifyObject(value);
    return { message, raw: stringifyObject(value) };
  }

  return { message: String(error) };
};

export function ErrorViewer({
  error,
  className
}: {
  error: unknown;
  className?: string;
}) {
  const normalized = useMemo(() => normalizeError(error), [error]);
  const [showDetails, setShowDetails] = useState(false);

  if (!normalized) return null;

  const { message, raw } = normalized;

  return (
    <div
      className={clsx(
        "rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800",
        className
      )}
      role="alert"
    >
      <div className="font-medium">Error</div>
      <div className="mt-1 whitespace-pre-wrap break-words">{message}</div>
      {raw && raw !== message && (
        <>
          <button
            type="button"
            className="mt-2 flex items-center gap-1 text-xs font-medium text-red-800"
            onClick={() => setShowDetails((v) => !v)}
          >
            <span
              className={`inline-block transition-transform ${showDetails ? "rotate-90" : ""}`}
            >
              ▸
            </span>
            {showDetails ? "Hide details" : "Show details"}
          </button>
          {showDetails && (
            <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap rounded border border-red-100 bg-white/70 p-2 text-xs text-red-800">
              {raw}
            </pre>
          )}
        </>
      )}
    </div>
  );
}
