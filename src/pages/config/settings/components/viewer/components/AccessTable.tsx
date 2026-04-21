import { useState, useMemo } from "react";
import type { ExternalConfigAccess } from "../types";
import { useSort, SortIcon } from "../hooks/useSort";
import {
  type Lookups,
  resolveConfigId,
  resolve,
  matchesSearch
} from "../utils";
import { JsonView } from "./JsonView";

interface Props {
  entries: ExternalConfigAccess[];
  lookups: Lookups;
  search?: string;
}

const COLS: { key: string; label: string; cls: string }[] = [
  { key: "id", label: "ID", cls: "px-3 py-2" },
  { key: "external_config_id", label: "Config", cls: "px-3 py-2" },
  { key: "external_user_aliases", label: "User", cls: "px-3 py-2" },
  { key: "external_role_aliases", label: "Role", cls: "px-3 py-2" },
  { key: "external_group_aliases", label: "Group", cls: "px-3 py-2" },
  { key: "created_at", label: "Created", cls: "px-3 py-2" }
];

const HIDDEN_KEYS = new Set([
  "id",
  "config_id",
  "external_config_id",
  "external_user_id",
  "external_user_aliases",
  "external_role_id",
  "external_role_aliases",
  "external_group_id",
  "external_group_aliases",
  "created_at"
]);

function AccessRow({
  entry,
  lookups
}: {
  entry: ExternalConfigAccess;
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
        <td className="whitespace-nowrap px-3 py-2 font-mono text-xs text-gray-500">
          {entry.id}
        </td>
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
          {(entry.external_role_aliases?.length
            ? entry.external_role_aliases
            : entry.external_role_id
              ? [entry.external_role_id]
              : []
          ).map((a, j) => (
            <span
              key={j}
              className="mr-1 inline-block rounded bg-purple-50 px-1.5 py-0.5 text-xs text-purple-600"
            >
              {resolve(lookups.roles, a)}
            </span>
          ))}
        </td>
        <td className="whitespace-nowrap px-3 py-2">
          {(entry.external_group_aliases?.length
            ? entry.external_group_aliases
            : entry.external_group_id
              ? [entry.external_group_id]
              : []
          ).map((a, j) => (
            <span
              key={j}
              className="mr-1 inline-block rounded bg-green-50 px-1.5 py-0.5 text-xs text-green-600"
            >
              {resolve(lookups.groups, a)}
            </span>
          ))}
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

export function AccessTable({ entries, lookups, search }: Props) {
  const filtered = useMemo(() => {
    if (!search) return entries;
    return entries.filter((e) => {
      const users = e.external_user_aliases?.length
        ? e.external_user_aliases
        : e.external_user_id
          ? [e.external_user_id]
          : [];
      const roles = e.external_role_aliases?.length
        ? e.external_role_aliases
        : e.external_role_id
          ? [e.external_role_id]
          : [];
      const groups = e.external_group_aliases?.length
        ? e.external_group_aliases
        : e.external_group_id
          ? [e.external_group_id]
          : [];

      return matchesSearch(
        search,
        e.id,
        resolveConfigId(lookups, e.external_config_id ?? e.config_id),
        e.config_id,
        e.external_user_id,
        e.external_role_id,
        e.external_group_id,
        e.created_at,
        ...users,
        ...roles,
        ...groups,
        ...users.map((u) => resolve(lookups.users, u)),
        ...roles.map((r) => resolve(lookups.roles, r)),
        ...groups.map((g) => resolve(lookups.groups, g))
      );
    });
  }, [entries, lookups, search]);
  const { sorted, sort, toggle } = useSort(filtered);

  if (!entries || entries.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-gray-400">
        No config access records
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
            <AccessRow
              key={
                e.id ||
                [
                  e.config_id ?? JSON.stringify(e.external_config_id ?? ""),
                  e.external_user_id ??
                    e.external_user_aliases?.join(",") ??
                    "",
                  e.created_at ?? ""
                ].join("|")
              }
              entry={e}
              lookups={lookups}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
