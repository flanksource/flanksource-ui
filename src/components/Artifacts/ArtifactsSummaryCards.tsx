import { ArtifactSummary } from "@flanksource-ui/api/types/artifacts";
import { fetchArtifactSummary } from "@flanksource-ui/api/services/artifacts";
import { formatBytes } from "@flanksource-ui/utils/common";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

type StorageBreakdown = {
  label: string;
  count: number;
  size: number;
};

type ContentTypeBreakdown = {
  contentType: string;
  count: number;
  size: number;
};

function aggregateSummary(rows: ArtifactSummary[]) {
  let totalCount = 0;
  let totalSize = 0;

  const storageMap = new Map<string, StorageBreakdown>();
  const typeMap = new Map<string, ContentTypeBreakdown>();

  for (const row of rows) {
    totalCount += row.total_count;
    totalSize += row.total_size;

    // Storage breakdown
    const storageKey =
      row.storage === "inline"
        ? "inline"
        : (row.connection_name ?? row.connection_id ?? "external");
    const existing = storageMap.get(storageKey) ?? {
      label:
        row.storage === "inline"
          ? "Inline (Database)"
          : (row.connection_name ?? "External"),
      count: 0,
      size: 0
    };
    existing.count += row.total_count;
    existing.size += row.total_size;
    storageMap.set(storageKey, existing);

    // Content type breakdown
    const ct = row.content_type || "unknown";
    const existingType = typeMap.get(ct) ?? {
      contentType: ct,
      count: 0,
      size: 0
    };
    existingType.count += row.total_count;
    existingType.size += row.total_size;
    typeMap.set(ct, existingType);
  }

  return {
    totalCount,
    totalSize,
    storage: [...storageMap.values()].sort((a, b) => b.size - a.size),
    contentTypes: [...typeMap.values()].sort((a, b) => b.count - a.count)
  };
}

export function ArtifactsSummaryCards() {
  const { data: summaryRows = [] } = useQuery({
    queryKey: ["artifact_summary"],
    queryFn: fetchArtifactSummary
  });

  const summary = useMemo(() => aggregateSummary(summaryRows), [summaryRows]);

  if (summary.totalCount === 0) {
    return null;
  }

  return (
    <div className="flex flex-row flex-wrap gap-4 py-4">
      {/* Total */}
      <SummaryCard
        title="Total"
        value={`${summary.totalCount}`}
        subtitle={formatBytes(summary.totalSize)}
      />

      {/* Storage breakdown */}
      {summary.storage.map((s) => (
        <SummaryCard
          key={s.label}
          title={s.label}
          value={`${s.count}`}
          subtitle={formatBytes(s.size)}
        />
      ))}

      {/* Content type breakdown */}
      {summary.contentTypes.map((ct) => (
        <SummaryCard
          key={ct.contentType}
          title={formatContentType(ct.contentType)}
          value={`${ct.count}`}
          subtitle={formatBytes(ct.size)}
        />
      ))}
    </div>
  );
}

function SummaryCard({
  title,
  value,
  subtitle
}: {
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="flex min-w-[120px] flex-col rounded-md border border-gray-200 bg-white px-4 py-3 shadow-sm">
      <span className="text-xs text-gray-500">{title}</span>
      <span className="text-lg font-semibold text-gray-900">{value}</span>
      <span className="text-xs text-gray-400">{subtitle}</span>
    </div>
  );
}

const CONTENT_TYPE_LABELS: Record<string, string> = {
  "application/json": "JSON",
  "application/yaml": "YAML",
  "text/plain": "Text",
  "text/markdown": "Markdown",
  "application/sql": "SQL",
  "text/x-shellscript": "Shell",
  "application/log+json": "Log JSON"
};

function formatContentType(ct: string): string {
  return CONTENT_TYPE_LABELS[ct] ?? ct;
}
