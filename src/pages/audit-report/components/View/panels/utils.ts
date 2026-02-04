import { GaugeConfig } from "../../../types";
import { formatBytes } from "../../../../../utils/common";

/**
 * Determines the color for a gauge based on percentage and defined thresholds.
 * Returns the color of the highest threshold that the percentage is greater than or equal to.
 *
 * @param percentage - The current value as a percentage (0-100)
 * @param thresholds - Array of threshold objects with percent and color values, sorted lowest to highest
 * @returns Hex color string corresponding to the applicable threshold, or first palette color if no threshold applies
 */
export const getGaugeColor = (
  percentage: number,
  thresholds: Array<{ percent: number; color: string }>
) => {
  const sortedThresholds = [...thresholds].sort(
    (a, b) => a.percent - b.percent
  );

  let selectedThreshold = sortedThresholds[0];

  for (const threshold of sortedThresholds) {
    if (percentage >= threshold.percent) {
      selectedThreshold = threshold;
    } else {
      break;
    }
  }

  return selectedThreshold?.color || COLOR_PALETTE[0];
};

/**
 * Generates gauge visualization data from a raw data row and gauge configuration.
 * Calculates percentage between min/max bounds and determines appropriate color based on thresholds.
 *
 * @param row - Data row containing 'value', 'health', and 'type' fields
 * @param gauge - Optional gauge configuration with min, max, and threshold values
 * @returns Object containing normalized percentage, original value, color, bounds, and label
 */
export const generateGaugeData = (
  row: Record<string, any>,
  gauge?: GaugeConfig
) => {
  const value = row.value || 0;
  const min = gauge?.min || 0;
  let percentage = 0;
  if (gauge && gauge.max !== min) {
    percentage = ((value - min) / (gauge.max - min)) * 100;
  }
  const clampedPercentage = Math.max(0, Math.min(100, percentage));

  let color = gauge?.thresholds
    ? getGaugeColor(clampedPercentage, gauge.thresholds)
    : COLOR_PALETTE[0];

  if (!gauge?.max) {
    color = "";
  }

  return {
    value: clampedPercentage,
    originalValue: value,
    color: color,
    max: gauge?.max,
    min: gauge?.min,
    label: row.health || row.type || "Value"
  };
};

/**
 * Formats a numeric value for display with optional unit and precision handling.
 * Provides special handling for common units like bytes and millicores.
 *
 * @param value - The numeric value to format
 * @param unit - Optional unit string ('bytes', 'millicores', or custom unit)
 * @param precision - Optional decimal places for rounding (ignored for 'bytes' unit)
 * @returns Formatted string with unit appended if provided
 *
 * @example
 * formatDisplayValue(1024, 'bytes') // "1 KB"
 * formatDisplayValue(500, 'millicores') // "500m"
 * formatDisplayValue(42.567, 'requests', 1) // "42.6 requests"
 */
export const formatDisplayValue = (
  value: number,
  unit?: string,
  precision?: number
): string => {
  if (!unit) {
    return Number(value.toFixed(precision || 0)).toString();
  }

  switch (unit) {
    case "percent":
      return `${Number(value.toFixed(precision || 0))}%`;
    case "bytes":
      return formatBytes(value);
    case "millicores":
    case "millicore":
      if (value === 0) return "0";
      if (value > 0 && value < 1) return `1m`;
      if (value >= 1000) {
        const cores = value / 1000;
        return cores === Math.round(cores)
          ? `${Math.round(cores)}`
          : `${cores.toFixed(1)}`;
      }
      return `${Math.round(value)}m`;
    default:
      const rounded = Number(value.toFixed(precision || 0));
      return `${rounded} ${unit}`;
  }
};

/**
 * Converts column/field names to display-friendly headers.
 * Handles both snake_case and camelCase formats.
 *
 * @param name - The field name to format
 * @returns Formatted header string with spaces and title casing
 *
 * @example
 * formatDisplayLabel('memory_limit') // "Memory Limit"
 * formatDisplayLabel('lastUpdated') // "Last Updated"
 */
export const formatDisplayLabel = (name: string): string => {
  return name
    .replace(/_/g, " ") // Convert underscores to spaces
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Add spaces before capital letters in camelCase
    .replace(/\b\w/g, (l) => l.toUpperCase()); // Capitalize first letter of each word
};

type Severity = "critical" | "high" | "medium" | "low" | "info" | "unknown";

/**
 * Determines the severity level for a status string using heuristic matching.
 * Uses both exact matches for common statuses and substring matching for flexible classification.
 */
export const getSeverityOfText = (status: string): Severity => {
  const statusLower = status.toLowerCase();
  // Specific status mappings
  switch (statusLower) {
    case "diff":
    case "healthunknown":
      return "info";

    case "pending":
    case "in-progress":
    case "mitigated":
    case "low":
    case "scaled to zero":
    case "terminating":
    case "upgradesucceeded":
      return "low";

    case "investigating":
    case "imagepullbackoff":
    case "rollbacksucceeded":
    case "terminating stalled":
    case "killing":
    case "medium":
      return "medium";

    case "critical":
    case "failed":
    case "fail":
    case "unhealthy":
    case "inactive":
      return "critical";

    case "high":
    case "unschedulable":
    case "sourcenotready":
    case "dormant":
      return "high";

    case "active":
      return "info";
  }

  // Dynamic heuristics for substring matches
  if (
    statusLower.includes("success") ||
    statusLower.includes("succeed") ||
    statusLower.includes("resolved") ||
    statusLower.includes("complete") ||
    statusLower.includes("healthy") ||
    statusLower.includes("pass") ||
    statusLower.includes("ok") ||
    statusLower.includes("running") ||
    statusLower.includes("active")
  ) {
    return "info";
  } else if (
    statusLower.includes("error") ||
    statusLower.includes("fail") ||
    statusLower.includes("reject") ||
    statusLower.includes("deny")
  ) {
    return "critical";
  } else if (
    statusLower.includes("warn") ||
    statusLower.includes("caution") ||
    statusLower.includes("alert")
  ) {
    return "medium";
  } else if (statusLower.includes("progress")) {
    return "info";
  }

  return "unknown";
};

/**
 * Maps severity levels to arrays of hex colors derived from Tailwind CSS.
 */
export const severityToHex: Record<Severity, string[]> = {
  info: [
    "#16a34a",
    "#22c55e",
    "#4ade80",
    "#15803d",
    "#059669",
    "#10b981",
    "#34d399",
    "#047857",
    "#065f46",
    "#14532d"
  ],
  low: [
    "#2563eb",
    "#0891b2",
    "#3b82f6",
    "#60a5fa",
    "#1d4ed8",
    "#0d9488",
    "#06b6d4",
    "#0ea5e9",
    "#38bdf8",
    "#1e40af",
    "#14b8a6",
    "#2dd4bf"
  ],
  medium: [
    "#eab308",
    "#f59e0b",
    "#fbbf24",
    "#d97706",
    "#fcd34d",
    "#ca8a04",
    "#b45309",
    "#a16207",
    "#facc15",
    "#f5d500"
  ],
  high: [
    "#ea580c",
    "#f97316",
    "#fb923c",
    "#c2410c",
    "#fdba74",
    "#9a3412",
    "#ed6c02",
    "#ff8c00",
    "#e65100",
    "#bf360c"
  ],
  critical: ["#dc2626", "#ef4444", "#f87171", "#b91c1c", "#fca5a5", "#e11d48"],
  unknown: [
    "#8b5cf6",
    "#06b6d4",
    "#ec4899",
    "#84cc16",
    "#6366f1",
    "#db2777",
    "#22d3ee",
    "#7c3aed",
    "#f43f5e",
    "#a855f7",
    "#c026d3",
    "#a3e635",
    "#4f46e5",
    "#f472b6",
    "#d946ef",
    "#fb7185",
    "#6b7280",
    "#9ca3af",
    "#4b5563"
  ]
};

/**
 * Deterministic hash function to convert text to a number.
 * Same text always produces same hash, different texts are distributed across the range.
 */
const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};

/**
 * Converts text to a hex color based on severity classification.
 * Gets the severity level for the text, then uses a deterministic hash to pick a color from that severity's palette.
 */
export const textToHex = (text: string): string => {
  const severity = getSeverityOfText(text);
  const colors = severityToHex[severity];
  const hash = hashString(text);

  return colors[hash % colors.length];
};

/**
 * Stable categorical color picker that spreads labels across a wide palette.
 * Falls back to positional assignment when the label is missing.
 */
export const getSeriesColor = (label: string, fallbackIndex = 0): string => {
  const paletteIndex = label
    ? Math.abs(hashString(label))
    : Math.abs(fallbackIndex);
  return COLOR_PALETTE[paletteIndex % COLOR_PALETTE.length];
};

/** Default color palette for charts (pre-shuffled at build time) */
export const COLOR_PALETTE = Object.values(severityToHex).flat();
