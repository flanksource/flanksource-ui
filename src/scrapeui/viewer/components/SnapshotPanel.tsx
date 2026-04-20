import { useMemo, useState } from "react";
import type {
  EntityWindowCounts,
  ScrapeSnapshot,
  ScrapeSnapshotDiff,
  ScrapeSnapshotPair
} from "../types";

interface Props {
  pairs?: Record<string, ScrapeSnapshotPair>;
}

type View = "diff" | "after" | "before";

const ZERO: EntityWindowCounts = {
  total: 0,
  updated_last: 0,
  updated_hour: 0,
  updated_day: 0,
  updated_week: 0,
  deleted_last: 0,
  deleted_hour: 0,
  deleted_day: 0,
  deleted_week: 0
};

function isZero(c?: EntityWindowCounts): boolean {
  if (!c) return true;
  return (
    c.total === 0 &&
    c.updated_last === 0 &&
    c.updated_hour === 0 &&
    c.updated_day === 0 &&
    c.updated_week === 0 &&
    c.deleted_last === 0 &&
    c.deleted_hour === 0 &&
    c.deleted_day === 0 &&
    c.deleted_week === 0 &&
    !c.last_created_at &&
    !c.last_updated_at
  );
}

function fmtTime(ts?: string): string {
  if (!ts) return "";
  const d = new Date(ts);
  return d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

function signed(n: number): string {
  if (n > 0) return `+${n}`;
  return `${n}`;
}

function cls(n: number, isDiff: boolean): string {
  if (!isDiff) return "text-gray-700";
  if (n > 0) return "text-green-600 font-medium";
  if (n < 0) return "text-red-600 font-medium";
  return "text-gray-400";
}

function fmt(n: number, isDiff: boolean): string {
  if (n === 0) return "";
  return isDiff ? signed(n) : String(n);
}

const ENTITY_ROWS: {
  key: keyof ScrapeSnapshot & keyof ScrapeSnapshotDiff;
  label: string;
}[] = [
  { key: "external_users", label: "External Users" },
  { key: "external_groups", label: "External Groups" },
  { key: "external_roles", label: "External Roles" },
  { key: "external_user_groups", label: "External User Groups" },
  { key: "config_access", label: "Config Access" },
  { key: "config_access_logs", label: "Access Logs" }
];

function CountsRow({
  label,
  counts,
  isDiff
}: {
  label: string;
  counts: EntityWindowCounts;
  isDiff: boolean;
}) {
  return (
    <tr className="border-b border-gray-100 text-sm">
      <td className="whitespace-nowrap px-3 py-1.5">{label}</td>
      <td
        className={`px-3 py-1.5 text-right tabular-nums ${cls(counts.total, isDiff)}`}
      >
        {fmt(counts.total, isDiff)}
      </td>
      <td
        className={`px-3 py-1.5 text-right text-xs tabular-nums ${cls(counts.updated_last, isDiff)}`}
      >
        {fmt(counts.updated_last, isDiff)}
      </td>
      <td
        className={`px-3 py-1.5 text-right text-xs tabular-nums ${cls(counts.updated_hour, isDiff)}`}
      >
        {fmt(counts.updated_hour, isDiff)}
      </td>
      <td
        className={`px-3 py-1.5 text-right text-xs tabular-nums ${cls(counts.updated_day, isDiff)}`}
      >
        {fmt(counts.updated_day, isDiff)}
      </td>
      <td
        className={`px-3 py-1.5 text-right text-xs tabular-nums ${cls(counts.updated_week, isDiff)}`}
      >
        {fmt(counts.updated_week, isDiff)}
      </td>
      <td
        className={`px-3 py-1.5 text-right text-xs tabular-nums ${cls(counts.deleted_last, isDiff)}`}
      >
        {fmt(counts.deleted_last, isDiff)}
      </td>
      <td
        className={`px-3 py-1.5 text-right text-xs tabular-nums ${cls(counts.deleted_hour, isDiff)}`}
      >
        {fmt(counts.deleted_hour, isDiff)}
      </td>
      <td
        className={`px-3 py-1.5 text-right text-xs tabular-nums ${cls(counts.deleted_day, isDiff)}`}
      >
        {fmt(counts.deleted_day, isDiff)}
      </td>
      <td
        className={`px-3 py-1.5 text-right text-xs tabular-nums ${cls(counts.deleted_week, isDiff)}`}
      >
        {fmt(counts.deleted_week, isDiff)}
      </td>
      <td className="whitespace-nowrap px-3 py-1.5 text-right text-xs tabular-nums text-gray-500">
        {fmtTime(counts.last_created_at)}
      </td>
      <td className="whitespace-nowrap px-3 py-1.5 text-right text-xs tabular-nums text-gray-500">
        {fmtTime(counts.last_updated_at)}
      </td>
    </tr>
  );
}

function CountsTable({
  title,
  rows,
  isDiff
}: {
  title: string;
  rows: { label: string; counts: EntityWindowCounts }[];
  isDiff: boolean;
}) {
  if (rows.length === 0) {
    return null;
  }
  return (
    <div className="mb-6">
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
        {title}
      </h4>
      <table className="w-full rounded border text-left">
        <thead className="bg-gray-50">
          <tr className="border-b text-xs text-gray-500">
            <th className="px-3 py-2"></th>
            <th className="px-3 py-2 text-right">Total</th>
            <th className="px-3 py-2 text-right" colSpan={4}>
              Updated (L / H / D / W)
            </th>
            <th className="px-3 py-2 text-right" colSpan={4}>
              Deleted (L / H / D / W)
            </th>
            <th className="px-3 py-2 text-right">Last Created</th>
            <th className="px-3 py-2 text-right">Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <CountsRow
              key={i}
              label={r.label}
              counts={r.counts}
              isDiff={isDiff}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderSection(
  data: ScrapeSnapshot | ScrapeSnapshotDiff | undefined,
  isDiff: boolean
) {
  if (!data) {
    return <div className="text-sm text-gray-400">No data</div>;
  }

  const perScraper = data.per_scraper || {};
  const perType = data.per_config_type || {};

  const scraperRows = Object.keys(perScraper)
    .sort()
    .filter((k) => !isZero(perScraper[k]))
    .map((k) => ({ label: k, counts: perScraper[k] }));

  const typeRows = Object.keys(perType)
    .sort()
    .filter((k) => !isZero(perType[k]))
    .map((k) => ({ label: k, counts: perType[k] }));

  const entityRows = ENTITY_ROWS.map(({ key, label }) => ({
    label,
    counts: ((data as any)[key] as EntityWindowCounts) || ZERO
  })).filter((r) => !isZero(r.counts));

  const empty =
    scraperRows.length === 0 &&
    typeRows.length === 0 &&
    entityRows.length === 0;
  if (empty && isDiff) {
    return (
      <div className="p-2 text-sm italic text-gray-500">
        No changes between before and after snapshots.
      </div>
    );
  }

  return (
    <div>
      <CountsTable title="Per Scraper" rows={scraperRows} isDiff={isDiff} />
      <CountsTable title="Per Config Type" rows={typeRows} isDiff={isDiff} />
      <CountsTable
        title="External Entities"
        rows={entityRows}
        isDiff={isDiff}
      />
    </div>
  );
}

export function SnapshotPanel({ pairs }: Props) {
  const scraperNames = useMemo(
    () => (pairs ? Object.keys(pairs).sort() : []),
    [pairs]
  );
  const [selectedScraper, setSelectedScraper] = useState<string | null>(null);
  const [userView, setUserView] = useState<View | null>(null);

  const activeScraper = selectedScraper || scraperNames[0] || null;
  const pair = activeScraper && pairs ? pairs[activeScraper] : undefined;

  // Default view picks the first side that actually has data: After for
  // successful runs, Before when the scrape failed before reaching the post-
  // save capture, Diff as a last resort.
  const defaultView: View = pair?.after
    ? "after"
    : pair?.before
      ? "before"
      : "diff";
  const view = userView ?? defaultView;

  if (!pairs || scraperNames.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-gray-400">
        No scrape snapshot captured for this run. Snapshots are only captured
        when running with a database connection.
      </div>
    );
  }

  const data =
    pair &&
    (view === "diff" ? pair.diff : view === "after" ? pair.after : pair.before);

  return (
    <div className="h-full overflow-auto p-4">
      <div className="mb-4 flex items-center gap-4">
        {scraperNames.length > 1 && (
          <select
            className="rounded border px-2 py-1 text-sm"
            value={activeScraper || ""}
            onChange={(e) =>
              setSelectedScraper((e.target as HTMLSelectElement).value)
            }
          >
            {scraperNames.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        )}
        <div className="flex overflow-hidden rounded border text-sm">
          {(["after", "diff", "before"] as View[]).map((v) => {
            const disabled =
              (v === "after" && !pair?.after) ||
              (v === "before" && !pair?.before);
            return (
              <button
                key={v}
                disabled={disabled}
                className={`px-3 py-1 capitalize ${view === v ? "bg-blue-500 text-white" : disabled ? "cursor-not-allowed bg-white text-gray-300" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                onClick={() => !disabled && setUserView(v)}
              >
                {v}
              </button>
            );
          })}
        </div>
        {(pair?.after || pair?.before) && (
          <div className="text-xs text-gray-500">
            run started at{" "}
            {new Date(
              (pair.after || pair.before)!.run_started_at
            ).toLocaleString()}
            {!pair.after && (
              <span className="ml-2 text-amber-600">
                (scrape failed — showing pre-scrape state)
              </span>
            )}
          </div>
        )}
      </div>
      {renderSection(data, view === "diff")}
    </div>
  );
}
