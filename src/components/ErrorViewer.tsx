import { isAxiosError } from "axios";
import clsx from "clsx";
import { useMemo, useState } from "react";

type ParsedError = {
  message: string;
  raw?: string;
};

function toJSON(value: Record<string, unknown>): string {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function extractResourceList(
  permission: string,
  context: Record<string, unknown>
): string[] {
  const objects = context.objects as Record<string, unknown> | undefined;
  if (!objects) return [];

  const resources: string[] = [];
  for (const [type, value] of Object.entries(objects)) {
    // Special handling for playbook:approve permission
    if (permission === "playbook:approve" && type !== "playbook") {
      continue;
    }

    if (value && typeof value === "object") {
      const obj = value as Record<string, unknown>;
      const resourceName = (obj.name as string) || (obj.title as string);
      if (resourceName) {
        resources.push(`${type}: ${resourceName}`);
      }
    }
  }

  return resources;
}

function parsePermissionError(
  errorData: Record<string, unknown>
): ParsedError | null {
  const context = errorData.context as Record<string, unknown> | undefined;
  const permission = context?.permission;
  const user = context?.user;

  if (!context || typeof permission !== "string" || typeof user !== "string") {
    return null;
  }

  const resources = extractResourceList(permission, context);
  const resourceInfo =
    resources.length > 0 ? ` on ${resources.join(", ")}` : "";

  return {
    message: `User ${user} doesn't have \`${permission}\` permission${resourceInfo}`,
    raw: toJSON(errorData)
  };
}

function parseAxiosError(error: unknown): ParsedError | null {
  if (!isAxiosError(error)) {
    return null;
  }

  const { response } = error;
  const data = response?.data;

  if (response?.status === 403 && data && typeof data === "object") {
    const permissionError = parsePermissionError(
      data as Record<string, unknown>
    );
    if (permissionError) {
      return permissionError;
    }
  }

  const parsed = parseError(data);
  if (parsed) {
    const statusText = response?.statusText ? ` ${response.statusText}` : "";
    const status =
      response?.status != null ? ` (HTTP ${response.status}${statusText})` : "";

    return {
      message: `${parsed.message}${status}`,
      raw:
        parsed.raw ??
        (data && typeof data === "object"
          ? toJSON(data as Record<string, unknown>)
          : typeof data === "string"
            ? data
            : undefined)
    };
  }

  return { message: error.message || "Request failed" };
}

function parseError(error: unknown): ParsedError | null {
  if (!error) return null;

  const axiosError = parseAxiosError(error);
  if (axiosError) return axiosError;

  if (typeof error === "string") {
    return { message: error, raw: error };
  }

  if (error instanceof Error) {
    const message = error.message ?? "";
    const trimmed = message.trim();
    if (trimmed && (trimmed.startsWith("{") || trimmed.startsWith("["))) {
      try {
        const parsed = JSON.parse(trimmed) as unknown;
        const parsedResult = parseError(parsed);
        if (parsedResult) {
          return parsedResult;
        }
      } catch {
        // Fall through to default error handling.
      }
    }

    return { message, raw: error.stack };
  }

  if (typeof error === "object") {
    const value = error as Record<string, unknown>;
    const message =
      (value.error as string) ||
      (value.message as string) ||
      (value.detail as string) ||
      (value.msg as string) ||
      toJSON(value);
    return { message, raw: toJSON(value) };
  }

  return { message: String(error) };
}

function CollapsibleRawError({ raw }: { raw: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <button
        type="button"
        className="mt-2 flex items-center gap-1 text-xs font-medium text-red-800"
        onClick={() => setExpanded((v) => !v)}
      >
        <span
          className={clsx(
            "inline-block transition-transform",
            expanded && "rotate-90"
          )}
        >
          ▸
        </span>
        {expanded ? "Hide details" : "Show details"}
      </button>
      {expanded && (
        <pre className="mt-2 max-h-64 max-w-full overflow-auto whitespace-pre-wrap break-all rounded border border-red-100 bg-white/70 p-2 text-xs text-red-800">
          {raw}
        </pre>
      )}
    </>
  );
}

export function ErrorViewer({
  error,
  className
}: {
  error: unknown;
  className?: string;
}) {
  const parsed = useMemo(() => parseError(error), [error]);

  if (!parsed) return null;

  const { message, raw } = parsed;
  const hasDetails = raw && raw !== message;

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
      {hasDetails && <CollapsibleRawError raw={raw} />}
    </div>
  );
}
