import { useEffect, useMemo, useState } from "react";
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

interface RowData {
  key: string;
  label: string;
  counts: EntityWindowCounts;
}

interface SectionData {
  title: string;
  rows: RowData[];
}

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

const VIEW_ORDER: View[] = ["after", "diff", "before"];

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

function formatTime(ts?: string): string {
  if (!ts) return "";
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

function asSigned(n: number): string {
  if (n > 0) return `+${n}`;
  return `${n}`;
}

function valueClassName(value: number, isDiff: boolean): string {
  if (!isDiff) return "text-gray-700";
  if (value > 0) return "font-medium text-green-600";
  if (value < 0) return "font-medium text-red-600";
  return "text-gray-400";
}

function formatValue(value: number, isDiff: boolean): string {
  if (value === 0) return "";
  return isDiff ? asSigned(value) : String(value);
}

function buildSections(
  data: ScrapeSnapshot | ScrapeSnapshotDiff | undefined
): SectionData[] {
  if (!data) return [];

  const perScraperRows: RowData[] = Object.entries(data.per_scraper || {})
    .sort(([a], [b]) => a.localeCompare(b))
    .filter(([, counts]) => !isZero(counts))
    .map(([name, counts]) => ({
      key: `scraper:${name}`,
      label: name,
      counts
    }));

  const perTypeRows: RowData[] = Object.entries(data.per_config_type || {})
    .sort(([a], [b]) => a.localeCompare(b))
    .filter(([, counts]) => !isZero(counts))
    .map(([name, counts]) => ({
      key: `type:${name}`,
      label: name,
      counts
    }));

  const externalRows: RowData[] = ENTITY_ROWS.map(({ key, label }) => ({
    key: `entity:${String(key)}`,
    label,
    counts: ((data as any)[key] as EntityWindowCounts) || ZERO
  })).filter((row) => !isZero(row.counts));

  return [
    { title: "Per Scraper", rows: perScraperRows },
    { title: "Per Config Type", rows: perTypeRows },
    { title: "External Entities", rows: externalRows }
  ];
}

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
        className={`px-3 py-1.5 text-right tabular-nums ${valueClassName(counts.total, isDiff)}`}
      >
        {formatValue(counts.total, isDiff)}
      </td>
      <td
        className={`px-3 py-1.5 text-right text-xs tabular-nums ${valueClassName(counts.updated_last, isDiff)}`}
      >
        {formatValue(counts.updated_last, isDiff)}
      </td>
      <td
        className={`px-3 py-1.5 text-right text-xs tabular-nums ${valueClassName(counts.updated_hour, isDiff)}`}
      >
        {formatValue(counts.updated_hour, isDiff)}
      </td>
      <td
        className={`px-3 py-1.5 text-right text-xs tabular-nums ${valueClassName(counts.updated_day, isDiff)}`}
      >
        {formatValue(counts.updated_day, isDiff)}
      </td>
      <td
        className={`px-3 py-1.5 text-right text-xs tabular-nums ${valueClassName(counts.updated_week, isDiff)}`}
      >
        {formatValue(counts.updated_week, isDiff)}
      </td>
      <td
        className={`px-3 py-1.5 text-right text-xs tabular-nums ${valueClassName(counts.deleted_last, isDiff)}`}
      >
        {formatValue(counts.deleted_last, isDiff)}
      </td>
      <td
        className={`px-3 py-1.5 text-right text-xs tabular-nums ${valueClassName(counts.deleted_hour, isDiff)}`}
      >
        {formatValue(counts.deleted_hour, isDiff)}
      </td>
      <td
        className={`px-3 py-1.5 text-right text-xs tabular-nums ${valueClassName(counts.deleted_day, isDiff)}`}
      >
        {formatValue(counts.deleted_day, isDiff)}
      </td>
      <td
        className={`px-3 py-1.5 text-right text-xs tabular-nums ${valueClassName(counts.deleted_week, isDiff)}`}
      >
        {formatValue(counts.deleted_week, isDiff)}
      </td>
      <td className="whitespace-nowrap px-3 py-1.5 text-right text-xs tabular-nums text-gray-500">
        {formatTime(counts.last_created_at)}
      </td>
      <td className="whitespace-nowrap px-3 py-1.5 text-right text-xs tabular-nums text-gray-500">
        {formatTime(counts.last_updated_at)}
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
  rows: RowData[];
  isDiff: boolean;
}) {
  if (rows.length === 0) {
    return null;
  }

  return (
    <section className="mb-6">
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
          {rows.map((row) => (
            <CountsRow
              key={row.key}
              label={row.label}
              counts={row.counts}
              isDiff={isDiff}
            />
          ))}
        </tbody>
      </table>
    </section>
  );
}

function SnapshotViewHeader({
  scraperNames,
  activeScraper,
  onScraperChange,
  view,
  onViewChange,
  hasAfter,
  hasBefore,
  hasDiff,
  runStartedAt
}: {
  scraperNames: string[];
  activeScraper: string;
  onScraperChange: (scraper: string) => void;
  view: View;
  onViewChange: (view: View) => void;
  hasAfter: boolean;
  hasBefore: boolean;
  hasDiff: boolean;
  runStartedAt?: string;
}) {
  return (
    <div className="mb-4 flex items-center gap-4">
      {scraperNames.length > 1 && (
        <select
          className="rounded border px-2 py-1 text-sm"
          value={activeScraper}
          onChange={(e) =>
            onScraperChange((e.target as HTMLSelectElement).value)
          }
        >
          {scraperNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      )}

      <div className="flex overflow-hidden rounded border text-sm">
        {VIEW_ORDER.map((candidate) => {
          const disabled =
            (candidate === "after" && !hasAfter) ||
            (candidate === "before" && !hasBefore) ||
            (candidate === "diff" && !hasDiff);

          return (
            <button
              type="button"
              key={candidate}
              disabled={disabled}
              className={`px-3 py-1 capitalize ${view === candidate ? "bg-blue-500 text-white" : disabled ? "cursor-not-allowed bg-white text-gray-300" : "bg-white text-gray-600 hover:bg-gray-50"}`}
              onClick={() => !disabled && onViewChange(candidate)}
            >
              {candidate}
            </button>
          );
        })}
      </div>

      {runStartedAt && (
        <div className="text-xs text-gray-500">
          run started at {new Date(runStartedAt).toLocaleString()}
          {!hasAfter && hasBefore && (
            <span className="ml-2 text-amber-600">
              (scrape failed — showing pre-scrape state)
            </span>
          )}
        </div>
      )}
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

  useEffect(() => {
    if (scraperNames.length === 0) {
      setSelectedScraper(null);
      setUserView(null);
      return;
    }

    if (!selectedScraper || !scraperNames.includes(selectedScraper)) {
      setSelectedScraper(scraperNames[0]);
    }
  }, [scraperNames, selectedScraper]);

  const activeScraper = selectedScraper ?? scraperNames[0] ?? null;
  const pair = activeScraper && pairs ? pairs[activeScraper] : undefined;

  const defaultView: View = pair?.after
    ? "after"
    : pair?.before
      ? "before"
      : "diff";

  const view: View = userView ?? defaultView;

  useEffect(() => {
    if (!userView) return;
    if (
      (userView === "after" && !pair?.after) ||
      (userView === "before" && !pair?.before) ||
      (userView === "diff" && !pair?.diff)
    ) {
      setUserView(null);
    }
  }, [pair?.after, pair?.before, pair?.diff, userView]);

  const data =
    pair &&
    (view === "diff" ? pair.diff : view === "after" ? pair.after : pair.before);

  const sections = useMemo(() => buildSections(data), [data]);

  if (!pairs || scraperNames.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-gray-400">
        No scrape snapshot captured for this run. Snapshots are only captured
        when running with a database connection.
      </div>
    );
  }

  const isDiffView = view === "diff";
  const isEmpty = sections.every((section) => section.rows.length === 0);

  return (
    <div className="h-full overflow-auto p-4">
      <SnapshotViewHeader
        scraperNames={scraperNames}
        activeScraper={activeScraper || ""}
        onScraperChange={setSelectedScraper}
        view={view}
        onViewChange={setUserView}
        hasAfter={!!pair?.after}
        hasBefore={!!pair?.before}
        hasDiff={!!pair?.diff}
        runStartedAt={(pair?.after || pair?.before)?.run_started_at}
      />

      {!data ? (
        <div className="text-sm text-gray-400">No data</div>
      ) : isDiffView && isEmpty ? (
        <div className="p-2 text-sm italic text-gray-500">
          No changes between before and after snapshots.
        </div>
      ) : (
        sections.map((section) => (
          <CountsTable
            key={section.title}
            title={section.title}
            rows={section.rows}
            isDiff={isDiffView}
          />
        ))
      )}
    </div>
  );
}
