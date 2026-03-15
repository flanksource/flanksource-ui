import { ConfigChange } from "@flanksource-ui/api/types/configs";
import dayjs from "dayjs";
import {
  BucketedRow,
  bucketChanges,
  calcPercent,
  generateTimeTicks,
  groupRowsByPrefix,
  mergeBuckets
} from "../ConfigChangesSwimlaneUtils";

function makeChange(overrides: Partial<ConfigChange> = {}): ConfigChange {
  return {
    id: "c1",
    config_id: "cfg1",
    change_type: "diff",
    created_at: "2024-01-15T12:00:00Z",
    first_observed: "2024-01-15T12:00:00Z",
    ...overrides
  } as ConfigChange;
}

const ZERO_SEVERITY = {
  critical: 0,
  high: 0,
  medium: 0,
  low: 0,
  info: 0,
  none: 0,
  total: 0
};

function makeRow(name: string, numBuckets: number): BucketedRow {
  return {
    name,
    config: { id: "cfg1", type: "Kubernetes::Pod", name },
    buckets: Array.from({ length: numBuckets }, () => []),
    severity: ZERO_SEVERITY,
    totalCount: 0
  };
}

// ── calcPercent ──

describe("calcPercent", () => {
  const min = dayjs("2024-01-01T00:00:00Z").valueOf();
  const max = dayjs("2024-01-02T00:00:00Z").valueOf();

  test("returns 0 at the min boundary", () => {
    expect(calcPercent("2024-01-01T00:00:00Z", min, max)).toBe(0);
  });

  test("returns 100 at the max boundary", () => {
    expect(calcPercent("2024-01-02T00:00:00Z", min, max)).toBe(100);
  });

  test("returns 50 at the midpoint", () => {
    expect(calcPercent("2024-01-01T12:00:00Z", min, max)).toBe(50);
  });

  test("returns 50 when min equals max", () => {
    expect(calcPercent("2024-01-01T00:00:00Z", min, min)).toBe(50);
  });
});

// ── generateTimeTicks ──

describe("generateTimeTicks", () => {
  test("returns single tick when min equals max", () => {
    expect(generateTimeTicks(100, 100)).toEqual([100]);
  });

  test("returns correct number of evenly spaced ticks", () => {
    const ticks = generateTimeTicks(0, 100, 3);
    expect(ticks).toEqual([0, 50, 100]);
  });

  test("defaults to 6 ticks", () => {
    const ticks = generateTimeTicks(0, 500);
    expect(ticks).toHaveLength(6);
    expect(ticks[0]).toBe(0);
    expect(ticks[5]).toBe(500);
  });
});

// ── bucketChanges ──

describe("bucketChanges", () => {
  const min = dayjs("2024-01-01T00:00:00Z").valueOf();
  const max = dayjs("2024-01-03T00:00:00Z").valueOf();

  test("distributes changes into correct buckets", () => {
    const changes = [
      makeChange({ id: "early", created_at: "2024-01-01T06:00:00Z" }),
      makeChange({ id: "late", created_at: "2024-01-02T18:00:00Z" })
    ];

    const result = bucketChanges(changes, 2, min, max);
    expect(result.buckets).toHaveLength(2);
    expect(result.buckets[0]!.map((c) => c.id)).toContain("early");
    expect(result.buckets[1]!.map((c) => c.id)).toContain("late");
  });

  test("places all changes in single bucket when numBuckets is 1", () => {
    const changes = [
      makeChange({ id: "a", created_at: "2024-01-01T00:00:00Z" }),
      makeChange({ id: "b", created_at: "2024-01-02T00:00:00Z" }),
      makeChange({ id: "c", created_at: "2024-01-03T00:00:00Z" })
    ];

    const result = bucketChanges(changes, 1, min, max);
    expect(result.buckets).toHaveLength(1);
    expect(result.buckets[0]).toHaveLength(3);
  });

  test("returns no preRangeBadge when all first_observed are in range", () => {
    const changes = [
      makeChange({
        created_at: "2024-01-02T00:00:00Z",
        first_observed: "2024-01-01T12:00:00Z"
      })
    ];
    const result = bucketChanges(changes, 3, min, max);
    expect(result.preRangeBadge).toBeUndefined();
  });

  test("returns preRangeBadge when first_observed is before min", () => {
    const changes = [
      makeChange({
        created_at: "2024-01-02T00:00:00Z",
        first_observed: "2023-12-01T00:00:00Z"
      })
    ];
    const result = bucketChanges(changes, 3, min, max);
    expect(result.preRangeBadge).toMatch(/↩/);
  });

  test("handles empty items array", () => {
    const result = bucketChanges([], 4, min, max);
    expect(result.buckets).toHaveLength(4);
    expect(result.buckets.every((b) => b.length === 0)).toBe(true);
    expect(result.preRangeBadge).toBeUndefined();
  });
});

// ── groupRowsByPrefix ──

describe("groupRowsByPrefix", () => {
  test("returns empty array for empty input", () => {
    expect(groupRowsByPrefix([])).toEqual([]);
  });

  test("standalone rows when no common prefix", () => {
    const rows = [makeRow("alpha", 2), makeRow("beta", 2)];
    const groups = groupRowsByPrefix(rows);
    expect(groups).toHaveLength(2);
    expect(groups.every((g) => !g.isGroup)).toBe(true);
  });

  test("groups rows sharing a hyphen-delimited prefix", () => {
    const rows = [
      makeRow("web-server-1", 2),
      makeRow("web-server-2", 2),
      makeRow("db-primary", 2)
    ];
    const groups = groupRowsByPrefix(rows);

    const webGroup = groups.find((g) => g.isGroup);
    expect(webGroup).toBeDefined();
    expect(webGroup!.prefix).toBe("web-server");
    expect(webGroup!.rows).toHaveLength(2);

    const dbRow = groups.find((g) => g.prefix === "db-primary");
    expect(dbRow).toBeDefined();
    expect(dbRow!.isGroup).toBe(false);
  });

  test("groups rows sharing an underscore-delimited prefix", () => {
    const rows = [makeRow("app_backend_v1", 2), makeRow("app_backend_v2", 2)];
    const groups = groupRowsByPrefix(rows);
    expect(groups).toHaveLength(1);
    expect(groups[0]!.isGroup).toBe(true);
    expect(groups[0]!.rows).toHaveLength(2);
  });

  test("single-member group becomes standalone", () => {
    const rows = [makeRow("api-gateway", 2), makeRow("web-server-1", 2)];
    const groups = groupRowsByPrefix(rows);
    expect(groups.every((g) => !g.isGroup)).toBe(true);
  });

  test("handles mixed delimiters across rows", () => {
    const rows = [
      makeRow("svc-auth-login", 2),
      makeRow("svc-auth-signup", 2),
      makeRow("cache_redis_primary", 2),
      makeRow("cache_redis_replica", 2)
    ];
    const groups = groupRowsByPrefix(rows);
    const groupNames = groups.filter((g) => g.isGroup).map((g) => g.prefix);
    expect(groupNames).toContain("cache-redis");
    expect(groupNames).toContain("svc-auth");
  });
});

// ── mergeBuckets ──

describe("mergeBuckets", () => {
  test("merges changes from multiple rows into one set of buckets", () => {
    const c1 = makeChange({ id: "r1b0" });
    const c2 = makeChange({ id: "r2b0" });
    const c3 = makeChange({ id: "r2b1" });

    const rows: BucketedRow[] = [
      {
        name: "a",
        config: undefined,
        buckets: [[c1], []],
        severity: ZERO_SEVERITY,
        totalCount: 1
      },
      {
        name: "b",
        config: undefined,
        buckets: [[c2], [c3]],
        severity: ZERO_SEVERITY,
        totalCount: 2
      }
    ];

    const merged = mergeBuckets(rows, 2);
    expect(merged[0]!.map((c) => c.id)).toEqual(["r1b0", "r2b0"]);
    expect(merged[1]!.map((c) => c.id)).toEqual(["r2b1"]);
  });

  test("returns empty buckets when rows have no changes", () => {
    const rows: BucketedRow[] = [
      {
        name: "a",
        config: undefined,
        buckets: [[], [], []],
        severity: ZERO_SEVERITY,
        totalCount: 0
      }
    ];
    const merged = mergeBuckets(rows, 3);
    expect(merged.every((b) => b.length === 0)).toBe(true);
  });
});
