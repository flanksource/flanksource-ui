import { useState, useMemo } from "react";
import type { HAREntry } from "../types";
import { statusColor, matchesSearch } from "../utils";
import { useSort, SortIcon } from "../hooks/useSort";
import { JsonView } from "./JsonView";

interface Props {
  entries: HAREntry[];
  search?: string;
}

function tryParseJson(text: string): any | null {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function isJsonType(mime?: string): boolean {
  return !!mime && (mime.includes("json") || mime.includes("javascript"));
}

function BodyView({ text, mimeType }: { text: string; mimeType?: string }) {
  if (isJsonType(mimeType)) {
    const parsed = tryParseJson(text);
    if (parsed !== null) return <JsonView data={parsed} />;
  }
  return <pre className="whitespace-pre-wrap break-all">{text}</pre>;
}

function HARRow({ entry }: { entry: HAREntry }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <tr
        className="cursor-pointer border-b border-gray-100 text-xs hover:bg-gray-50"
        onClick={() => setOpen(!open)}
      >
        <td className="whitespace-nowrap px-2 py-1.5 font-mono font-medium">
          {entry.request.method}
        </td>
        <td
          className="max-w-0 truncate px-2 py-1.5 font-mono"
          title={entry.request.url}
        >
          {entry.request.url}
        </td>
        <td
          className={`whitespace-nowrap px-2 py-1.5 font-medium ${statusColor(entry.response.status)}`}
        >
          {entry.response.status}
        </td>
        <td className="whitespace-nowrap px-2 py-1.5 text-right text-gray-500">
          {entry.time.toFixed(0)}ms
        </td>
        <td className="whitespace-nowrap px-2 py-1.5 text-right text-gray-500">
          {formatBytes(entry.response.bodySize)}
        </td>
        <td className="whitespace-nowrap px-2 py-1.5 text-gray-400">
          {entry.response.content?.mimeType || ""}
        </td>
      </tr>
      {open && (
        <tr>
          <td colSpan={6} className="bg-gray-50 p-3 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="mb-1 font-semibold text-gray-700">
                  Request Headers
                </div>
                <div className="space-y-0.5">
                  {entry.request.headers?.map((h, i) => (
                    <div key={i} className="whitespace-nowrap">
                      <span className="text-purple-600">{h.name}:</span>{" "}
                      {h.value}
                    </div>
                  ))}
                </div>
                {entry.request.postData?.text && (
                  <div className="mt-2">
                    <div className="mb-1 font-semibold text-gray-700">
                      Request Body
                    </div>
                    <div className="max-h-48 overflow-auto rounded border bg-white p-2">
                      <BodyView
                        text={entry.request.postData.text}
                        mimeType={entry.request.postData.mimeType}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div>
                <div className="mb-1 font-semibold text-gray-700">
                  Response Headers
                </div>
                <div className="space-y-0.5">
                  {entry.response.headers?.map((h, i) => (
                    <div key={i} className="whitespace-nowrap">
                      <span className="text-purple-600">{h.name}:</span>{" "}
                      {h.value}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {entry.response.content?.text && (
              <div className="mt-3">
                <div className="mb-1 font-semibold text-gray-700">
                  Response Body
                </div>
                <div className="max-h-64 overflow-auto rounded border bg-white p-2">
                  <BodyView
                    text={entry.response.content.text}
                    mimeType={entry.response.content.mimeType}
                  />
                </div>
              </div>
            )}
          </td>
        </tr>
      )}
    </>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 0) return "";
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}

const COLS: { key: string; label: string; cls: string }[] = [
  { key: "request.method", label: "Method", cls: "px-2 py-2 w-16" },
  { key: "request.url", label: "URL", cls: "px-2 py-2" },
  { key: "response.status", label: "Status", cls: "px-2 py-2 w-20" },
  { key: "time", label: "Time", cls: "px-2 py-2 w-16 text-right" },
  { key: "response.bodySize", label: "Size", cls: "px-2 py-2 w-16 text-right" },
  { key: "response.content.mimeType", label: "Type", cls: "px-2 py-2 w-40" }
];

export function HARPanel({ entries, search }: Props) {
  const filtered = useMemo(() => {
    if (!search) return entries;
    return entries.filter((e) =>
      matchesSearch(
        search,
        e.request.url,
        e.request.method,
        e.request.postData?.text,
        e.response.content?.text
      )
    );
  }, [entries, search]);
  const { sorted, sort, toggle } = useSort(filtered, "time");

  if (!entries || entries.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-gray-400">
        No HTTP traffic captured
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <table className="w-full table-fixed text-left">
        <thead className="sticky top-0 bg-gray-50">
          <tr className="border-b text-xs text-gray-500">
            {COLS.map((c) => (
              <th
                key={c.key}
                className={`${c.cls} cursor-pointer select-none whitespace-nowrap hover:text-gray-700`}
                onClick={() => toggle(c.key)}
              >
                {c.label}
                <SortIcon active={sort?.key === c.key} dir={sort?.dir} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((e) => (
            <HARRow
              key={[
                e.startedDateTime,
                e.request.method,
                e.request.url,
                e.response.status,
                e.time
              ].join("|")}
              entry={e}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
