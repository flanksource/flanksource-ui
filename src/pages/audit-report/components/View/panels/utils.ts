import { GaugeConfig } from "../../../types";
import { formatBytes } from "../../../../../utils/common";

/**
 * Maps status color indices (0-5) to arrays of hex colors derived from Tailwind CSS.
 * Index meanings:
 * - 0: Gray (unknown/default status)
 * - 1: Green (success, resolved, healthy)
 * - 2: Blue (in-progress, pending)
 * - 3: Yellow (warning)
 * - 4: Orange (high severity)
 * - 5: Red (critical/error)
 */
export const COLOR_INDEX_TO_HEX: Record<number, string[]> = {
  0: ["#4b5563", "#78716c"], // Gray: gray-600, stone-600
  1: ["#16a34a", "#22c55e", "#15803d", "#059669"], // Green: green-600, green-500, green-700, teal-600
  2: ["#2563eb", "#0891b2", "#3b82f6", "#1d4ed8", "#0d9488"], // Blue: blue-600, cyan-600, blue-500, blue-800, teal-600
  3: ["#eab308", "#f59e0b", "#d97706"], // Yellow: yellow-500, amber-500, amber-600
  4: ["#ea580c", "#f97316", "#d97706"], // Orange: orange-600, orange-500, amber-600
  5: ["#dc2626", "#ef4444", "#991b1b"] // Red: red-600, red-500, red-900
};

/** Default color palette for charts, combining all colors from COLOR_INDEX_TO_HEX flattened */
export const COLOR_PALETTE = Object.values(COLOR_INDEX_TO_HEX).flat();

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

  const color = gauge?.thresholds
    ? getGaugeColor(clampedPercentage, gauge.thresholds)
    : COLOR_PALETTE[0];

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

/**
 * Determines a color index (0-5) for a status string using heuristic matching.
 * Uses both exact matches for common statuses and substring matching for flexible classification.
 *
 * Color index mapping:
 * - 0: Gray (unknown/unmatched status)
 * - 1: Green (success, resolved, healthy, active)
 * - 2: Blue (in-progress, pending, low severity)
 * - 3: Yellow (warning, medium severity)
 * - 4: Orange (high severity)
 * - 5: Red (critical, error, failure)
 *
 * @param status - The status string to classify
 * @returns Color index (0-5) corresponding to the status
 *
 * @example
 * getStatusColorIndex('success') // 1 (Green)
 * getStatusColorIndex('Error: Connection failed') // 5 (Red)
 * getStatusColorIndex('unknown-status') // 0 (Gray)
 */
export const getStatusColorIndex = (status: string): number => {
  const statusLower = status.toLowerCase();

  // Specific status mappings
  switch (statusLower) {
    case "pending":
    case "in-progress":
    case "mitigated":
    case "low":
    case "scaled to zero":
      return 2; // Blue
    case "investigating":
    case "medium":
      return 3; // Yellow
    case "critical":
      return 5; // Red
    case "high":
      return 4; // Orange
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
    return 1; // Green (best)
  } else if (
    statusLower.includes("error") ||
    statusLower.includes("fail") ||
    statusLower.includes("reject") ||
    statusLower.includes("deny")
  ) {
    return 5; // Red (worst)
  } else if (
    statusLower.includes("warn") ||
    statusLower.includes("caution") ||
    statusLower.includes("alert")
  ) {
    return 3; // Yellow
  } else if (statusLower.includes("progress")) {
    return 1; // Green (running/progress is good)
  }

  return 0; // Gray (unknown/default)
};
