import { useState, useMemo } from "react";
import type { ExternalConfigAccessLog } from "../types";
import { useSort, SortIcon } from "../hooks/useSort";
import {
  type Lookups,
  resolveConfigId,
  resolve,
  matchesSearch
} from "../utils";
import { JsonView } from "./JsonView";

interface Props {
  entries: ExternalConfigAccessLog[];
  lookups: Lookups;
  search?: string;
}

const COLS: { key: string; label: string; cls: string }[] = [
  { key: "external_config_id", label: "Config", cls: "px-3 py-2" },
  { key: "external_user_aliases", label: "User", cls: "px-3 py-2" },
  { key: "mfa", label: "MFA", cls: "px-3 py-2 w-16" },
  { key: "count", label: "Count", cls: "px-3 py-2 w-16 text-right" },
  { key: "created_at", label: "Timestamp", cls: "px-3 py-2" }
];

const HIDDEN_KEYS = new Set([
  "config_id",
  "external_config_id",
  "external_user_id",
  "external_user_aliases",
  "mfa",
  "count",
  "created_at",
  "scraper_id"
]);

function AccessLogRow({
  entry,
  lookups
}: {
  entry: ExternalConfigAccessLog;
  lookups: Lookups;
}) {
  const [open, setOpen] = useState(false);

  const extraProps = useMemo(() => {
    const out: Record<string, any> = {};
    for (const [k, v] of Object.entries(entry)) {
      if (HIDDEN_KEYS.has(k)) continue;
      if (
        v === null ||
        v === undefined ||
        v === "" ||
        v === "00000000-0000-0000-0000-000000000000"
      )
        continue;
      if (Array.isArray(v) && v.length === 0) continue;
      if (
        typeof v === "object" &&
        !Array.isArray(v) &&
        Object.keys(v).length === 0
      )
        continue;
      out[k] = v;
    }
    return out;
  }, [entry]);

  return (
    <>
      <tr
        className="cursor-pointer border-b border-gray-100 text-sm hover:bg-gray-50"
        onClick={() => setOpen(!open)}
      >
        <td className="whitespace-nowrap px-3 py-2 text-xs">
          {resolveConfigId(
            lookups,
            entry.external_config_id ?? entry.config_id
          )}
        </td>
        <td className="whitespace-nowrap px-3 py-2">
          {(entry.external_user_aliases?.length
            ? entry.external_user_aliases
            : entry.external_user_id
              ? [entry.external_user_id]
              : []
          ).map((a, j) => (
            <span
              key={j}
              className="mr-1 inline-block rounded bg-blue-50 px-1.5 py-0.5 text-xs text-blue-600"
            >
              {resolve(lookups.users, a)}
            </span>
          ))}
        </td>
        <td className="whitespace-nowrap px-3 py-2">
          {typeof entry.mfa === "boolean" && (
            <span
              className={`text-xs font-medium ${entry.mfa ? "text-green-600" : "text-red-500"}`}
            >
              {entry.mfa ? "Yes" : "No"}
            </span>
          )}
        </td>
        <td className="whitespace-nowrap px-3 py-2 text-right text-gray-600">
          {entry.count ?? ""}
        </td>
        <td className="whitespace-nowrap px-3 py-2 text-xs text-gray-500">
          {entry.created_at || ""}
        </td>
      </tr>
      {open && Object.keys(extraProps).length > 0 && (
        <tr>
          <td colSpan={COLS.length} className="bg-gray-50 px-4 py-3">
            <JsonView data={extraProps} />
          </td>
        </tr>
      )}
    </>
  );
}

export function AccessLogTable({ entries, lookups, search }: Props) {
  const filtered = useMemo(() => {
    if (!search) return entries;
    return entries.filter((e) => {
      const users = e.external_user_aliases?.length
        ? e.external_user_aliases
        : e.external_user_id
          ? [e.external_user_id]
          : [];

      return matchesSearch(
        search,
        resolveConfigId(lookups, e.external_config_id ?? e.config_id),
        e.config_id,
        e.external_user_id,
        e.created_at,
        ...users,
        ...users.map((u) => resolve(lookups.users, u))
      );
    });
  }, [entries, lookups, search]);
  const { sorted, sort, toggle } = useSort(filtered);

  if (!entries || entries.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-gray-400">
        No access log entries
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <table className="w-full text-left">
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
            <AccessLogRow
              key={[
                e.config_id ?? JSON.stringify(e.external_config_id ?? ""),
                e.external_user_id ?? e.external_user_aliases?.join(",") ?? "",
                e.created_at ?? "",
                e.count ?? ""
              ].join("|")}
              entry={e}
              lookups={lookups}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
