import { ConfigChange } from "@flanksource-ui/api/types/configs";
import { DateType } from "@flanksource-ui/api/types/common";
import { relativeDateTime } from "@flanksource-ui/utils/date";
import dayjs from "dayjs";
import { useCallback, useEffect, useRef, useState } from "react";

export const ICON_WIDTH = 20;
export const BUCKET_MIN_PX = ICON_WIDTH * 5;
export const MIN_COLUMN_WIDTH = 150;
export const MAX_COLUMN_WIDTH = 500;
export const DEFAULT_COLUMN_WIDTH = 360;

export type SeverityCounts = {
  critical: number;
  high: number;
  medium: number;
  low: number;
  info: number;
  none: number;
  total: number;
};

export function countSeverities(changes: ConfigChange[]): SeverityCounts {
  const counts: SeverityCounts = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    info: 0,
    none: 0,
    total: changes.length
  };
  for (const c of changes) {
    const s = c.severity?.toLowerCase();
    if (s === "critical" || s === "blocker") counts.critical++;
    else if (s === "high") counts.high++;
    else if (s === "medium" || s === "warning") counts.medium++;
    else if (s === "low") counts.low++;
    else if (s === "info") counts.info++;
    else counts.none++;
  }
  return counts;
}

const SEVERITY_MATCHERS: Record<string, (s: string | undefined) => boolean> = {
  critical: (s) => s === "critical" || s === "blocker",
  high: (s) => s === "high",
  medium: (s) => s === "medium" || s === "warning",
  low: (s) => s === "low",
  info: (s) => s === "info"
};

export function filterBySeverity(
  changes: ConfigChange[],
  severityKey: string
): ConfigChange[] {
  const matcher = SEVERITY_MATCHERS[severityKey];
  if (!matcher) return [];
  return changes.filter((c) => matcher(c.severity?.toLowerCase()));
}

export type BucketedRow = {
  name: string;
  config: ConfigChange["config"];
  buckets: ConfigChange[][];
  preRangeBadge?: string;
  severity: SeverityCounts;
  lastObserved?: DateType;
  totalCount: number;
};

export type SwimlaneGroup = {
  prefix: string;
  rows: BucketedRow[];
  isGroup: boolean;
};

export function calcPercent(
  time: string | Date | undefined,
  min: number,
  max: number
): number {
  const t = dayjs(time).valueOf();
  return max === min ? 50 : ((t - min) / (max - min)) * 100;
}

export function generateTimeTicks(
  min: number,
  max: number,
  count = 6
): number[] {
  if (min === max) return [min];
  const step = (max - min) / (count - 1);
  return Array.from({ length: count }, (_, i) => min + step * i);
}

export function bucketChanges(
  items: ConfigChange[],
  numBuckets: number,
  min: number,
  max: number
): { buckets: ConfigChange[][]; preRangeBadge?: string } {
  const buckets: ConfigChange[][] = Array.from(
    { length: numBuckets },
    () => []
  );

  let preRangeFirstObserved: string | undefined;

  for (const change of items) {
    const pct = calcPercent(change.created_at, min, max);
    const idx = Math.min(
      numBuckets - 1,
      Math.max(0, Math.floor((pct / 100) * numBuckets))
    );
    buckets[idx]!.push(change);

    const fo = dayjs(change.first_observed);
    const ca = dayjs(change.created_at);
    if (fo.isBefore(dayjs(min)) && ca.diff(fo, "minute") > 1) {
      if (!preRangeFirstObserved || fo.isBefore(dayjs(preRangeFirstObserved))) {
        preRangeFirstObserved = change.first_observed;
      }
    }
  }

  for (const bucket of buckets) {
    bucket.sort(
      (a, b) => dayjs(a.created_at).valueOf() - dayjs(b.created_at).valueOf()
    );
  }

  return {
    buckets,
    preRangeBadge: preRangeFirstObserved
      ? `↩ ${relativeDateTime(preRangeFirstObserved, dayjs(min).toISOString())}`
      : undefined
  };
}

export type GroupedChange = {
  representative: ConfigChange;
  count: number;
  changes: ConfigChange[];
};

export function groupBucketByType(bucket: ConfigChange[]): GroupedChange[] {
  const map = new Map<string, GroupedChange>();
  for (const change of bucket) {
    const key = change.change_type;
    const existing = map.get(key);
    if (existing) {
      existing.count++;
      existing.changes.push(change);
    } else {
      map.set(key, { representative: change, count: 1, changes: [change] });
    }
  }
  return Array.from(map.values());
}

export function useResizableColumn(initial: number) {
  const [width, setWidth] = useState(initial);
  const dragging = useRef(false);
  const userResized = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  useEffect(() => {
    if (!userResized.current) setWidth(initial);
  }, [initial]);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      dragging.current = true;
      startX.current = e.clientX;
      startWidth.current = width;

      const onMouseMove = (ev: MouseEvent) => {
        if (!dragging.current) return;
        const delta = ev.clientX - startX.current;
        setWidth(
          Math.min(
            MAX_COLUMN_WIDTH,
            Math.max(MIN_COLUMN_WIDTH, startWidth.current + delta)
          )
        );
      };

      const onMouseUp = () => {
        dragging.current = false;
        userResized.current = true;
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [width]
  );

  return { width, onMouseDown };
}

export function useContainerWidth(ref: React.RefObject<HTMLDivElement | null>) {
  const [containerWidth, setContainerWidth] = useState(800);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);

  return containerWidth;
}

const DELIMITER_RE = /[-_/]|::/;

function tokenize(name: string): string[] {
  return name.split(DELIMITER_RE).filter(Boolean);
}

function longestCommonPrefixTokens(a: string[], b: string[]): number {
  let count = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i] === b[i]) count++;
    else break;
  }
  return count;
}

export function groupRowsByPrefix(rows: BucketedRow[]): SwimlaneGroup[] {
  if (rows.length === 0) return [];

  const sorted = [...rows].sort((a, b) => a.name.localeCompare(b.name));
  const groups: SwimlaneGroup[] = [];
  let i = 0;

  while (i < sorted.length) {
    const currentTokens = tokenize(sorted[i]!.name);
    let groupEnd = i + 1;
    let commonLen = 0;

    if (groupEnd < sorted.length) {
      const nextTokens = tokenize(sorted[groupEnd]!.name);
      commonLen = longestCommonPrefixTokens(currentTokens, nextTokens);
    }

    if (commonLen < 1) {
      groups.push({
        prefix: sorted[i]!.name,
        rows: [sorted[i]!],
        isGroup: false
      });
      i++;
      continue;
    }

    const prefixTokens = currentTokens.slice(0, commonLen);
    while (groupEnd < sorted.length) {
      const nextTokens = tokenize(sorted[groupEnd]!.name);
      if (longestCommonPrefixTokens(prefixTokens, nextTokens) >= commonLen) {
        groupEnd++;
      } else {
        break;
      }
    }

    const groupRows = sorted.slice(i, groupEnd);
    if (groupRows.length === 1) {
      groups.push({
        prefix: groupRows[0]!.name,
        rows: groupRows,
        isGroup: false
      });
    } else {
      groups.push({
        prefix: prefixTokens.join("-"),
        rows: groupRows,
        isGroup: true
      });
    }
    i = groupEnd;
  }

  return groups;
}

export type LabelPlacement = "right" | "left" | "extra" | "none";

export type PlacedIcon = {
  bucketIdx: number;
  groupIdx: number;
  xPct: number;
  yRow: number;
  label: LabelPlacement;
  changeType: string;
};

const PLACEMENT_PATTERNS: LabelPlacement[][] = [
  ["right"],
  ["left", "right"],
  ["left", "right", "left"],
  ["left", "right", "left", "right"]
];

export function computeLabelPlacements(
  buckets: ConfigChange[][],
  numBuckets: number,
  min: number,
  max: number
): Map<string, PlacedIcon> {
  const result = new Map<string, PlacedIcon>();
  const range = max - min || 1;
  const bucketSpan = range / numBuckets;
  const bucketWidthPct = 100 / numBuckets;

  const seenTypes = new Set<string>();
  const deferredTypes = new Set<string>();

  for (let bIdx = 0; bIdx < numBuckets; bIdx++) {
    const bucket = buckets[bIdx];
    if (!bucket || bucket.length === 0) continue;

    const grouped = groupBucketByType(bucket);
    const bStart = min + bIdx * bucketSpan;

    const iconPositions: { gIdx: number; localPct: number; type: string }[] =
      [];
    const labelCandidates: number[] = [];

    for (let gIdx = 0; gIdx < grouped.length; gIdx++) {
      const group = grouped[gIdx]!;
      const type = group.representative.change_type;
      const t = dayjs(group.representative.created_at).valueOf();
      const localPct = Math.max(
        0,
        Math.min(100, ((t - bStart) / bucketSpan) * 100)
      );

      iconPositions.push({ gIdx, localPct, type });

      if (!seenTypes.has(type) || deferredTypes.has(type)) {
        labelCandidates.push(iconPositions.length - 1);
      }
    }

    const labelCount = Math.min(labelCandidates.length, 4);
    const pattern = labelCount > 0 ? PLACEMENT_PATTERNS[labelCount - 1]! : [];

    for (let i = 0; i < labelCandidates.length; i++) {
      const pos = iconPositions[labelCandidates[i]!]!;
      seenTypes.add(pos.type);
      deferredTypes.delete(pos.type);
    }

    for (const pos of iconPositions) {
      const candidateIdx = labelCandidates.indexOf(iconPositions.indexOf(pos));
      let placement: LabelPlacement = "none";
      if (candidateIdx >= 0 && candidateIdx < pattern.length) {
        placement = pattern[candidateIdx]!;
      } else if (candidateIdx >= pattern.length) {
        placement = "extra";
      }

      result.set(`${bIdx}-${pos.gIdx}`, {
        bucketIdx: bIdx,
        groupIdx: pos.gIdx,
        xPct: pos.localPct,
        yRow: 0,
        label: placement,
        changeType: pos.type
      });
    }
  }

  return result;
}

export function mergeBuckets(
  rows: BucketedRow[],
  numBuckets: number
): ConfigChange[][] {
  const merged: ConfigChange[][] = Array.from({ length: numBuckets }, () => []);
  for (const row of rows) {
    for (let b = 0; b < numBuckets; b++) {
      if (row.buckets[b]) {
        merged[b]!.push(...row.buckets[b]!);
      }
    }
  }
  return merged;
}
