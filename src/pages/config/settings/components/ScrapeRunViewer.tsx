import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import pako from "pako";
import type { Counts, Snapshot, ScrapeResult, Tab } from "./viewer/types";
import {
  groupByType,
  filterItems,
  collectTypes,
  buildLookups,
  globalSearch
} from "./viewer/utils";
import { useRoute } from "./viewer/hooks/useRoute";
import { SplitPane } from "./viewer/components/SplitPane";
import { ScraperList } from "./viewer/components/ScraperList";
import { Summary } from "./viewer/components/Summary";
import { FilterBar, type Filters } from "./viewer/components/FilterBar";
import { ConfigTree } from "./viewer/components/ConfigTree";
import { DetailPanel } from "./viewer/components/DetailPanel";
import { AnsiHtml } from "./viewer/components/AnsiHtml";
import { HARPanel } from "./viewer/components/HARPanel";
import { EntityTable } from "./viewer/components/EntityTable";
import { AccessTable } from "./viewer/components/AccessTable";
import { AccessLogTable } from "./viewer/components/AccessLogTable";
import { ScrapeConfigPanel } from "./viewer/components/ScrapeConfigPanel";
import { SnapshotPanel } from "./viewer/components/SnapshotPanel";
import { JsonView } from "./viewer/components/JsonView";

const TAB_DEFS: { key: Tab; label: string; icon: string; countKey?: string }[] =
  [
    {
      key: "configs",
      label: "Configs",
      icon: "codicon:server-process",
      countKey: "configs"
    },
    { key: "logs", label: "Logs", icon: "codicon:terminal" },
    { key: "har", label: "HTTP", icon: "codicon:globe" },
    {
      key: "users",
      label: "Users",
      icon: "codicon:person",
      countKey: "external_users"
    },
    {
      key: "groups",
      label: "Groups",
      icon: "codicon:organization",
      countKey: "external_groups"
    },
    {
      key: "roles",
      label: "Roles",
      icon: "codicon:shield",
      countKey: "external_roles"
    },
    {
      key: "access",
      label: "Access",
      icon: "codicon:lock",
      countKey: "config_access"
    },
    {
      key: "access_logs",
      label: "Access Logs",
      icon: "codicon:history",
      countKey: "access_logs"
    },
    { key: "issues", label: "Issues", icon: "codicon:warning" },
    { key: "snapshot", label: "Snapshot", icon: "codicon:database" },
    { key: "last_summary", label: "Last Summary", icon: "codicon:pulse" },
    { key: "spec", label: "Spec", icon: "codicon:file-code" }
  ];

function buildCounts(results: any, relationships: any[]): Counts {
  const configs = results?.configs || [];
  return {
    configs: configs.length,
    changes: (results?.changes || []).length,
    analysis: (results?.analysis || []).length,
    relationships: (relationships || []).length,
    external_users: (results?.external_users || []).length,
    external_groups: (results?.external_groups || []).length,
    external_roles: (results?.external_roles || []).length,
    config_access: (results?.config_access || []).length,
    access_logs: (results?.config_access_logs || []).length,
    errors: configs.filter((r: any) => !!r?.error).length
  };
}

function toSnapshot(payload: any): Snapshot {
  if (payload?.scrapers && payload?.results && payload?.counts) {
    return payload as Snapshot;
  }

  const results = payload?.results || {};
  const relationships = payload?.relationships || results?.relationships || [];
  const startedAtMs = payload?.started_at
    ? new Date(payload.started_at).getTime()
    : Date.now();

  const snapshots = payload?.snapshot_pair
    ? {
        [payload?.scraper_name || payload?.scraper_id || "run"]:
          payload.snapshot_pair
      }
    : undefined;

  return {
    scrapers: payload?.scrapers || [],
    results,
    relationships,
    config_meta: payload?.config_meta,
    issues: payload?.issues || [],
    counts: buildCounts(results, relationships),
    save_summary: payload?.save_summary,
    snapshots,
    scrape_spec: payload?.scrape_spec,
    properties: payload?.properties,
    log_level: payload?.log_level,
    har: payload?.har || [],
    logs: payload?.logs || "",
    done: payload?.done ?? true,
    started_at: Number.isFinite(startedAtMs) ? startedAtMs : Date.now(),
    build_info: payload?.build_info,
    last_scrape_summary: payload?.last_scrape_summary
  };
}

const terminalStatuses = new Set(["SUCCESS", "FAILED", "WARNING", "STOPPED"]);

function isTerminal(status?: string) {
  return !!status && terminalStatuses.has(status);
}

type JobHistoryRecord = {
  status?: string;
  time_start?: string;
  created_at?: string;
  details?: any;
};

type ArtifactRecord = {
  id: string;
  filename?: string;
  path?: string;
  created_at?: string;
};

async function parseArtifactError(response: Response, fallback: string) {
  let message = fallback;

  try {
    const raw = await response.text();
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        message = parsed?.error || parsed?.message || raw;
      } catch {
        message = raw;
      }
    }
  } catch {
    // ignore body parsing errors and use fallback message
  }

  return message;
}

async function readArtifactText(response: Response): Promise<string> {
  if (!response.ok) {
    const message = await parseArtifactError(
      response,
      `artifact download failed (${response.status})`
    );
    throw new Error(message);
  }

  const bytes = new Uint8Array(await response.arrayBuffer());
  const isGzip = bytes.length > 2 && bytes[0] === 0x1f && bytes[1] === 0x8b;

  return isGzip
    ? (pako.ungzip(bytes, { to: "string" }) as string)
    : new TextDecoder().decode(bytes);
}

async function parseArtifactSnapshotResponse(
  response: Response
): Promise<Snapshot> {
  const jsonText = await readArtifactText(response);
  return toSnapshot(JSON.parse(jsonText));
}

async function parseArtifactJSONResponse<T>(response: Response): Promise<T> {
  const jsonText = await readArtifactText(response);
  return JSON.parse(jsonText) as T;
}

function artifactName(artifact: ArtifactRecord): string {
  const file = artifact.filename || artifact.path?.split("/").pop() || "";
  return file.toLowerCase();
}

function pickArtifact(
  artifacts: ArtifactRecord[],
  matcher: (name: string) => boolean
): ArtifactRecord | undefined {
  return artifacts.find((artifact) => matcher(artifactName(artifact)));
}

async function fetchJobHistory(
  jobHistoryId: string
): Promise<JobHistoryRecord | null> {
  const response = await fetch(
    `/api/db/job_histories?select=*&id=eq.${encodeURIComponent(jobHistoryId)}&limit=1`
  );

  if (!response.ok) {
    const message = await parseArtifactError(
      response,
      `failed to fetch job history (${response.status})`
    );
    throw new Error(message);
  }

  const rows = (await response.json()) as JobHistoryRecord[];
  return rows?.[0] ?? null;
}

async function fetchArtifactsForJobHistory(
  jobHistoryId: string
): Promise<ArtifactRecord[]> {
  const response = await fetch(
    `/api/db/artifacts?select=id,filename,path,created_at&job_history_id=eq.${encodeURIComponent(jobHistoryId)}&deleted_at=is.null&order=created_at.desc`
  );

  if (!response.ok) {
    const message = await parseArtifactError(
      response,
      `failed to fetch run artifacts (${response.status})`
    );
    throw new Error(message);
  }

  return (await response.json()) as ArtifactRecord[];
}

interface ScrapeRunViewerProps {
  jobHistoryId: string;
  syncRouteWithURL?: boolean;
  containerClassName?: string;
}

export function ScrapeRunViewer({
  jobHistoryId,
  syncRouteWithURL = true,
  containerClassName = "flex h-screen flex-col bg-gray-100"
}: ScrapeRunViewerProps) {
  const [route, navigate] = useRoute({
    syncWithURL: syncRouteWithURL
  });
  const { tab, id: routeId, q: routeQ } = route;
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [done, setDone] = useState(false);
  const [status, setStatus] = useState("Loading...");
  const [selected, setSelected] = useState<ScrapeResult | null>(null);
  const [expandAll, setExpandAll] = useState<boolean | null>(null);
  const [filters, setFilters] = useState<Filters>({
    health: new Set(),
    type: new Set()
  });
  const [elapsed, setElapsed] = useState(0);
  const search = routeQ || "";
  const setSearch = (value: string) => navigate({ q: value || undefined });
  const doneRef = useRef(false);
  const startRef = useRef(0);
  const logsRef = useRef<HTMLDivElement>(null);
  const initialTabRef = useRef(tab);
  const navigateRef = useRef(navigate);
  const summaryArtifactIdRef = useRef<string | undefined>(undefined);
  const logsArtifactIdRef = useRef<string | undefined>(undefined);
  const harArtifactIdRef = useRef<string | undefined>(undefined);
  const snapshotsArtifactIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);

  const applySnap = useCallback((snap: Snapshot) => {
    startRef.current = snap.started_at;
    setSnapshot(snap);
    if (snap.done) {
      doneRef.current = true;
      setDone(true);
      setStatus("Scrape complete");
      setElapsed(Date.now() - snap.started_at);
    } else {
      setStatus("Scraping...");
    }
    if (
      (snap.results?.configs?.length ?? 0) > 0 &&
      tabRef.current === "spec" &&
      initialTabRef.current === "spec"
    ) {
      navigateRef.current({ tab: "configs" });
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const mergeSnapshot = (partial: Partial<Snapshot>) => {
      setSnapshot((prev) => {
        if (!prev) return prev;
        return { ...prev, ...partial };
      });
    };

    const loadArtifacts = async (artifacts: ArtifactRecord[]) => {
      const summaryArtifact = pickArtifact(
        artifacts,
        (name) =>
          name.includes("summary") &&
          (name.endsWith(".json") || name.endsWith(".json.gz"))
      );

      if (
        summaryArtifact &&
        summaryArtifact.id !== summaryArtifactIdRef.current
      ) {
        const snap = await fetch(
          `/api/artifacts/download/${encodeURIComponent(summaryArtifact.id)}`
        ).then(parseArtifactSnapshotResponse);

        if (cancelled) return;
        summaryArtifactIdRef.current = summaryArtifact.id;
        applySnap(snap);
      }

      const logsArtifact = pickArtifact(
        artifacts,
        (name) => name === "logs.txt" || name === "logs.txt.gz"
      );
      if (logsArtifact && logsArtifact.id !== logsArtifactIdRef.current) {
        const logs = await fetch(
          `/api/artifacts/download/${encodeURIComponent(logsArtifact.id)}`
        ).then(readArtifactText);

        if (cancelled) return;
        logsArtifactIdRef.current = logsArtifact.id;
        mergeSnapshot({ logs });
      }

      const harArtifact = pickArtifact(
        artifacts,
        (name) => name === "har.json" || name === "har.json.gz"
      );
      if (harArtifact && harArtifact.id !== harArtifactIdRef.current) {
        const rawHar = await fetch(
          `/api/artifacts/download/${encodeURIComponent(harArtifact.id)}`
        ).then(parseArtifactJSONResponse<any>);

        if (cancelled) return;

        const entries = Array.isArray(rawHar)
          ? rawHar
          : rawHar?.log?.entries || rawHar?.entries || [];

        harArtifactIdRef.current = harArtifact.id;
        mergeSnapshot({ har: entries });
      }

      const snapshotsArtifact = pickArtifact(
        artifacts,
        (name) => name === "snapshots.json" || name === "snapshots.json.gz"
      );
      if (
        snapshotsArtifact &&
        snapshotsArtifact.id !== snapshotsArtifactIdRef.current
      ) {
        const snapshots = await fetch(
          `/api/artifacts/download/${encodeURIComponent(snapshotsArtifact.id)}`
        ).then(parseArtifactJSONResponse<Record<string, any>>);

        if (cancelled) return;
        snapshotsArtifactIdRef.current = snapshotsArtifact.id;
        mergeSnapshot({ snapshots });
      }
    };

    const poll = async () => {
      try {
        const jobHistory = await fetchJobHistory(jobHistoryId);

        if (cancelled) return;

        if (!jobHistory) {
          setStatus("Waiting for job history...");
          return;
        }

        if (!startRef.current) {
          const startedAt =
            (jobHistory.time_start &&
              new Date(jobHistory.time_start).getTime()) ||
            (jobHistory.created_at &&
              new Date(jobHistory.created_at).getTime()) ||
            Date.now();
          startRef.current = startedAt;
        }

        const currentStatus = jobHistory.status;
        const terminal = isTerminal(currentStatus);

        if (!terminal) {
          setStatus(
            currentStatus ? `Scraping... (${currentStatus})` : "Scraping..."
          );
          return;
        }

        if (currentStatus === "FAILED") {
          setStatus("Scrape failed");
        } else {
          setStatus("Scrape complete");
        }

        const artifacts = await fetchArtifactsForJobHistory(jobHistoryId);

        if (cancelled) return;

        if (artifacts.length > 0) {
          await loadArtifacts(artifacts);
        } else {
          setStatus("Run completed. Waiting for artifacts...");
        }

        const hasSummary = !!summaryArtifactIdRef.current;
        const shouldComplete =
          terminal && (currentStatus === "FAILED" || hasSummary);

        if (shouldComplete) {
          doneRef.current = true;
          setDone(true);
          if (startRef.current) {
            setElapsed(Date.now() - startRef.current);
          }
        }
      } catch (error: unknown) {
        if (cancelled) return;
        const message =
          error instanceof Error ? error.message : "Failed to load scrape run";
        setStatus(message);
      } finally {
        if (!cancelled && !doneRef.current) {
          timer = setTimeout(poll, 2000);
        }
      }
    };

    doneRef.current = false;
    setDone(false);
    setStatus("Loading...");
    setSnapshot(null);
    setSelected(null);
    setElapsed(0);
    startRef.current = 0;
    summaryArtifactIdRef.current = undefined;
    logsArtifactIdRef.current = undefined;
    harArtifactIdRef.current = undefined;
    snapshotsArtifactIdRef.current = undefined;

    poll();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [applySnap, jobHistoryId]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (startRef.current && !doneRef.current) {
        setElapsed(Date.now() - startRef.current);
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const tabRef = useRef(tab);
  tabRef.current = tab;

  // Auto-scroll logs
  useEffect(() => {
    if (tab === "logs" && logsRef.current) {
      logsRef.current.scrollTop = logsRef.current.scrollHeight;
    }
  }, [snapshot?.logs, tab]);

  const configs = useMemo(
    () => snapshot?.results?.configs || [],
    [snapshot?.results?.configs]
  );

  // Sync selected config with URL route id (when on configs tab)
  useEffect(() => {
    if (tab !== "configs") return;
    if (!routeId) {
      setSelected(null);
      return;
    }
    if (selected?.id === routeId) return;
    const match = configs.find((c) => c.id === routeId);
    if (match) setSelected(match);
  }, [routeId, configs, tab, selected?.id]);
  const orphanedConfigs = useMemo(() => {
    return (snapshot?.issues || [])
      .filter((issue) => issue.type === "orphaned" && issue.change)
      .map(
        (issue, i): ScrapeResult => ({
          id: `orphaned-${i}`,
          name:
            issue.change!.summary ||
            issue.change!.change_type ||
            `Orphaned #${i + 1}`,
          config_type: "Orphaned Changes",
          health: "warning",
          config: issue.change
        })
      );
  }, [snapshot?.issues]);

  const allConfigs = useMemo(
    () => [...configs, ...orphanedConfigs],
    [configs, orphanedConfigs]
  );

  const filtered = useMemo(() => {
    let items = filterItems(allConfigs, filters.health, filters.type);
    if (search) {
      const lq = search.toLowerCase();
      items = items.filter(
        (c) =>
          c.name?.toLowerCase().includes(lq) ||
          c.config_type?.toLowerCase().includes(lq) ||
          c.aliases?.some((a) => a.toLowerCase().includes(lq)) ||
          Object.entries(c.labels || {}).some(
            ([k, v]) =>
              k.toLowerCase().includes(lq) || v.toLowerCase().includes(lq)
          ) ||
          Object.entries(c.tags || {}).some(
            ([k, v]) =>
              k.toLowerCase().includes(lq) || v.toLowerCase().includes(lq)
          ) ||
          JSON.stringify(c.config)?.toLowerCase().includes(lq)
      );
    }
    return items;
  }, [allConfigs, filters, search]);
  const groups = useMemo(() => groupByType(filtered), [filtered]);
  const types = useMemo(() => collectTypes(allConfigs), [allConfigs]);
  const healthValues = useMemo(() => {
    const vals = new Set<string>();
    for (const item of allConfigs) vals.add(item.health || "unknown");
    return Array.from(vals).sort();
  }, [allConfigs]);

  const counts: Record<string, number> = (snapshot?.counts as any) || {};

  const zero = () => ({
    changes: 0,
    access: 0,
    accessLogs: 0,
    analysis: 0,
    relationships: 0
  });

  const configCounts = useMemo(() => {
    const m = new Map<string, ReturnType<typeof zero>>();
    const changes = snapshot?.results?.changes || [];
    const access = snapshot?.results?.config_access || [];
    const logs = snapshot?.results?.config_access_logs || [];
    const relationships = snapshot?.relationships || [];

    for (const ch of changes) {
      if (!ch.source) continue;
      for (const cfg of configs) {
        if (ch.source.includes(cfg.id)) {
          const c = m.get(cfg.id) || zero();
          c.changes++;
          m.set(cfg.id, c);
        }
      }
    }
    for (const a of access) {
      const extId =
        (a.external_config_id as any)?.external_id || a.external_config_id;
      if (!extId) continue;
      for (const cfg of configs) {
        if (cfg.id === extId) {
          const c = m.get(cfg.id) || zero();
          c.access++;
          m.set(cfg.id, c);
        }
      }
    }
    for (const l of logs) {
      const extId =
        (l.external_config_id as any)?.external_id || l.external_config_id;
      if (!extId) continue;
      for (const cfg of configs) {
        if (cfg.id === extId) {
          const c = m.get(cfg.id) || zero();
          c.accessLogs++;
          m.set(cfg.id, c);
        }
      }
    }
    for (const rel of relationships) {
      if (rel.config_id) {
        const c = m.get(rel.config_id) || zero();
        c.relationships++;
        m.set(rel.config_id, c);
      }
      if (rel.related_id && rel.related_id !== rel.config_id) {
        const c = m.get(rel.related_id) || zero();
        c.relationships++;
        m.set(rel.related_id, c);
      }
    }
    return m;
  }, [snapshot?.results, snapshot?.relationships, configs]);

  const lookups = useMemo(
    () => buildLookups(snapshot?.results),
    [snapshot?.results]
  );

  const searchCounts = useMemo(
    () =>
      globalSearch(search, snapshot?.results, snapshot?.har, snapshot?.logs),
    [search, snapshot?.results, snapshot?.har, snapshot?.logs]
  );

  const scraperErrors = useMemo(
    () =>
      (snapshot?.scrapers || []).filter((s) => s.status === "error" && s.error),
    [snapshot?.scrapers]
  );

  return (
    <div className={containerClassName}>
      {/* Header */}
      <div className="border-b bg-white px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">
              <iconify-icon
                icon="codicon:server-process"
                className="mr-1.5 text-blue-600"
              />
              Scrape Results
            </h1>
            <span className="text-sm text-gray-400">{status}</span>
            {snapshot?.build_info && (
              <span
                className="font-mono text-xs text-gray-400"
                title={`commit ${snapshot.build_info.commit}\nbuilt ${snapshot.build_info.date}`}
              >
                {snapshot.build_info.version}
                {snapshot.build_info.commit &&
                  snapshot.build_info.commit !== "none" && (
                    <> · {snapshot.build_info.commit.substring(0, 8)}</>
                  )}
                {snapshot.build_info.date &&
                  snapshot.build_info.date !== "unknown" && (
                    <> · {snapshot.build_info.date}</>
                  )}
              </span>
            )}
          </div>
          {snapshot && (
            <Summary
              counts={snapshot.counts}
              saveSummary={snapshot.save_summary}
              startedAt={snapshot.started_at}
              done={done}
              elapsed={elapsed}
            />
          )}
        </div>
        {snapshot && (
          <div className="mt-2">
            <ScraperList scrapers={snapshot.scrapers} />
          </div>
        )}
      </div>

      {/* Scrape error banner — surfaces errors from failed scrapers so they
          aren't just a small red chip in the scraper list. */}
      {scraperErrors.length > 0 && (
        <div className="border-b border-red-200 bg-red-50 px-6 py-3">
          {scraperErrors.map((s) => (
            <div key={s.name} className="flex items-start gap-2 text-sm">
              <iconify-icon
                icon="codicon:error"
                className="mt-0.5 flex-shrink-0 text-red-500"
              />
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-red-700">
                  {s.name} failed
                </div>
                <div className="whitespace-pre-wrap break-all font-mono text-xs text-red-600">
                  {s.error}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab bar */}
      <div className="flex items-center gap-1 overflow-x-auto border-b bg-white px-6">
        {TAB_DEFS.map((t) => {
          const count = t.countKey
            ? counts[t.countKey] || 0
            : t.key === "har"
              ? snapshot?.har?.length || 0
              : t.key === "logs"
                ? snapshot?.logs
                  ? 1
                  : 0
                : t.key === "issues"
                  ? snapshot?.issues?.length || 0
                  : 0;
          const isActive = tab === t.key;
          const searchHits = search ? searchCounts[t.key] || 0 : 0;

          // Hide tabs with no data (except configs, logs, spec, snapshot, last_summary)
          if (
            !count &&
            !isActive &&
            !searchHits &&
            !["configs", "logs", "spec", "snapshot", "last_summary"].includes(
              t.key
            )
          )
            return null;

          return (
            <button
              type="button"
              key={t.key}
              className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "border-blue-500 font-medium text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
              onClick={() => navigate({ tab: t.key, id: undefined })}
            >
              <iconify-icon icon={t.icon} />
              {t.label}
              {count > 0 && !search && (
                <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">
                  {count}
                </span>
              )}
              {search && searchHits > 0 && (
                <span className="rounded-full bg-yellow-100 px-1.5 py-0.5 text-xs text-yellow-700">
                  {searchHits}
                </span>
              )}
            </button>
          );
        })}
        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <iconify-icon
              icon="codicon:search"
              className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-gray-400"
            />
            <input
              type="text"
              placeholder="Search across all tabs..."
              value={search}
              onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
              className="w-64 rounded-md border border-gray-300 py-1 pl-7 pr-7 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {search && (
              <button
                type="button"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setSearch("")}
              >
                <iconify-icon icon="codicon:close" className="text-sm" />
              </button>
            )}
          </div>
          <button
            type="button"
            className="rounded p-1 text-gray-400 transition-colors hover:text-blue-600"
            title="Copy link to current view"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              const btn = document.activeElement as HTMLElement;
              btn?.blur();
            }}
          >
            <iconify-icon icon="codicon:link" className="text-base" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {tab === "configs" && (
          <div className="flex h-full flex-col">
            <div className="shrink-0 border-b bg-white px-6 py-2">
              {configs.length > 0 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-600 hover:bg-gray-200"
                    onClick={() => setExpandAll(true)}
                  >
                    Expand
                  </button>
                  <button
                    type="button"
                    className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-600 hover:bg-gray-200"
                    onClick={() => setExpandAll(false)}
                  >
                    Collapse
                  </button>
                  <FilterBar
                    filters={filters}
                    onChange={setFilters}
                    healthValues={healthValues}
                    typeValues={types}
                  />
                </div>
              )}
            </div>
            <SplitPane
              defaultSplit={40}
              left={
                <>
                  {groups.map((g) => (
                    <ConfigTree
                      key={g.type}
                      groups={[g]}
                      selected={selected}
                      onSelect={(item) =>
                        navigate({ tab: "configs", id: item.id })
                      }
                      expandAll={expandAll}
                      configCounts={configCounts}
                    />
                  ))}
                  {configs.length === 0 && !done && (
                    <div className="p-8 text-center text-gray-400">
                      <iconify-icon
                        icon="svg-spinners:ring-resize"
                        className="text-3xl text-blue-500"
                      />
                      <p className="mt-2">Waiting for scrape results...</p>
                    </div>
                  )}
                  {filtered.length === 0 && configs.length > 0 && (
                    <div className="p-8 text-center text-sm text-gray-400">
                      No items match the current filters
                    </div>
                  )}
                </>
              }
              right={
                <DetailPanel
                  item={selected}
                  changes={snapshot?.results?.changes}
                  relationships={snapshot?.relationships}
                  configMeta={snapshot?.config_meta}
                  access={snapshot?.results?.config_access}
                  accessLogs={snapshot?.results?.config_access_logs}
                  allUsers={snapshot?.results?.external_users}
                  allGroups={snapshot?.results?.external_groups}
                  allRoles={snapshot?.results?.external_roles}
                  lookups={lookups}
                  onNavigate={(kind, id) => navigate({ tab: kind, id })}
                />
              }
            />
          </div>
        )}

        {tab === "logs" && (
          <div ref={logsRef} className="h-full overflow-auto bg-gray-900">
            {snapshot?.logs ? (
              <AnsiHtml
                text={snapshot.logs}
                className="p-4 text-xs leading-relaxed text-gray-200"
              />
            ) : (
              <div className="p-8 text-center text-gray-500">
                {done ? "No logs captured" : "Waiting for logs..."}
              </div>
            )}
          </div>
        )}

        {tab === "har" && (
          <HARPanel entries={snapshot?.har || []} search={search} />
        )}

        {tab === "users" && (
          <EntityTable
            title="Users"
            kind="user"
            entities={snapshot?.results?.external_users || []}
            access={snapshot?.results?.config_access}
            accessLogs={snapshot?.results?.config_access_logs}
            userGroups={snapshot?.results?.external_user_groups}
            allUsers={snapshot?.results?.external_users}
            allGroups={snapshot?.results?.external_groups}
            lookups={lookups}
            search={search}
            selectedId={routeId}
            onSelect={(id) => navigate({ tab: "users", id })}
          />
        )}
        {tab === "groups" && (
          <EntityTable
            title="Groups"
            kind="group"
            entities={snapshot?.results?.external_groups || []}
            access={snapshot?.results?.config_access}
            accessLogs={snapshot?.results?.config_access_logs}
            userGroups={snapshot?.results?.external_user_groups}
            allUsers={snapshot?.results?.external_users}
            allGroups={snapshot?.results?.external_groups}
            lookups={lookups}
            search={search}
            selectedId={routeId}
            onSelect={(id) => navigate({ tab: "groups", id })}
          />
        )}
        {tab === "roles" && (
          <EntityTable
            title="Roles"
            kind="role"
            entities={snapshot?.results?.external_roles || []}
            access={snapshot?.results?.config_access}
            accessLogs={snapshot?.results?.config_access_logs}
            lookups={lookups}
            search={search}
            selectedId={routeId}
            onSelect={(id) => navigate({ tab: "roles", id })}
          />
        )}
        {tab === "access" && (
          <AccessTable
            entries={snapshot?.results?.config_access || []}
            lookups={lookups}
            search={search}
          />
        )}
        {tab === "access_logs" && (
          <AccessLogTable
            entries={snapshot?.results?.config_access_logs || []}
            lookups={lookups}
            search={search}
          />
        )}

        {tab === "issues" && (
          <div className="h-full overflow-auto p-4">
            {!snapshot?.issues || snapshot.issues.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-400">
                No issues found
              </div>
            ) : (
              <div className="space-y-2">
                {snapshot.issues.map((issue, i) => (
                  <div
                    key={i}
                    className={`rounded border p-3 text-sm ${
                      issue.type === "fk_error"
                        ? "border-red-200 bg-red-50"
                        : issue.type === "warning"
                          ? "border-yellow-200 bg-yellow-50"
                          : "border-amber-200 bg-amber-50"
                    }`}
                  >
                    <div className="mb-1 flex items-center gap-2">
                      <span
                        className={`rounded px-1.5 py-0.5 text-xs font-medium ${
                          issue.type === "fk_error"
                            ? "bg-red-100 text-red-700"
                            : issue.type === "warning"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {issue.type}
                      </span>
                      {issue.message && (
                        <span className="text-gray-600">{issue.message}</span>
                      )}
                      {issue.warning?.count && issue.warning.count > 1 && (
                        <span className="ml-1 text-xs text-gray-400">
                          &times;{issue.warning.count}
                        </span>
                      )}
                    </div>
                    {issue.change && (
                      <div className="mt-1 space-y-0.5 text-xs">
                        <div>
                          <span className="text-gray-500">change_type:</span>{" "}
                          <span className="font-medium">
                            {issue.change.change_type}
                          </span>
                        </div>
                        {issue.change.config_type && (
                          <div>
                            <span className="text-gray-500">config_type:</span>{" "}
                            {issue.change.config_type}
                          </div>
                        )}
                        {issue.change.external_id && (
                          <div>
                            <span className="text-gray-500">external_id:</span>{" "}
                            <span className="font-mono">
                              {issue.change.external_id}
                            </span>
                          </div>
                        )}
                        {issue.change.summary && (
                          <div>
                            <span className="text-gray-500">summary:</span>{" "}
                            {issue.change.summary}
                          </div>
                        )}
                        {issue.change.source && (
                          <div>
                            <span className="text-gray-500">source:</span>{" "}
                            {issue.change.source}
                          </div>
                        )}
                        {issue.change.severity && (
                          <div>
                            <span className="text-gray-500">severity:</span>{" "}
                            {issue.change.severity}
                          </div>
                        )}
                        {issue.change.created_at && (
                          <div>
                            <span className="text-gray-500">created_at:</span>{" "}
                            {issue.change.created_at}
                          </div>
                        )}
                      </div>
                    )}
                    {issue.warning && (
                      <div className="mt-1 space-y-1 text-xs">
                        {issue.warning.expr && (
                          <div>
                            <span className="text-gray-500">expr:</span>{" "}
                            <code className="rounded bg-gray-100 px-1 font-mono">
                              {issue.warning.expr}
                            </code>
                          </div>
                        )}
                        {issue.warning.input && (
                          <details className="mt-1">
                            <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
                              input
                            </summary>
                            <div className="mt-1 max-h-48 overflow-auto rounded bg-gray-100 p-2">
                              {typeof issue.warning.input === "object" ? (
                                <JsonView data={issue.warning.input} />
                              ) : (
                                <pre className="whitespace-pre-wrap break-all">
                                  {String(issue.warning.input)}
                                </pre>
                              )}
                            </div>
                          </details>
                        )}
                        {issue.warning.output && (
                          <details className="mt-1">
                            <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
                              output
                            </summary>
                            <div className="mt-1 max-h-48 overflow-auto rounded bg-gray-100 p-2">
                              {typeof issue.warning.output === "object" ? (
                                <JsonView data={issue.warning.output} />
                              ) : (
                                <pre className="whitespace-pre-wrap break-all">
                                  {String(issue.warning.output)}
                                </pre>
                              )}
                            </div>
                          </details>
                        )}
                        {issue.warning.result && (
                          <details className="mt-1">
                            <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
                              result
                            </summary>
                            <div className="mt-1 max-h-48 overflow-auto rounded bg-gray-100 p-2">
                              {typeof issue.warning.result === "object" ? (
                                <JsonView data={issue.warning.result} />
                              ) : (
                                <pre className="whitespace-pre-wrap break-all">
                                  {String(issue.warning.result)}
                                </pre>
                              )}
                            </div>
                          </details>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "snapshot" && <SnapshotPanel pairs={snapshot?.snapshots} />}
        {tab === "last_summary" && (
          <div className="h-full overflow-auto p-4">
            {snapshot?.last_scrape_summary ? (
              <JsonView data={snapshot.last_scrape_summary} />
            ) : (
              <div className="p-8 text-center text-sm text-gray-400">
                No previous scrape summary available (first run or no database
                connection)
              </div>
            )}
          </div>
        )}
        {tab === "spec" && (
          <ScrapeConfigPanel
            spec={snapshot?.scrape_spec}
            properties={snapshot?.properties}
            logLevel={snapshot?.log_level}
          />
        )}
      </div>
    </div>
  );
}
