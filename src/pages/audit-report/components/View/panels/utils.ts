import { GaugeConfig } from "../../../types";

export const COLOR_BANK = [
  "#4F83EF", // bright but balanced blue
  "#28C19B", // turquoise / emerald
  "#F4B23C", // golden amber
  "#F25C54", // vivid coral
  "#9A7DFF", // lavender-violet
  "#21B3D8", // clear cyan
  "#8BC34A", // fresh lime-green
  "#FF8C42", // warm orange
  "#E8589C", // lively pink
  "#5965F2", // indigo-blue
  "#1FB3A3", // teal sea-foam
  "#F04E6E", // rose red
  "#B678FA", // soft-vibrant violet
  "#39C76E", // spring green
  "#E5C844", // mellow yellow-gold
  "#7F8FA6", // steel grey (neutral anchor)
  "#8E7C70", // warm stone (earthy neutral)
  "#D63A3A", // bold brick-red
  "#2E6FF7", // saturated sky-blue
  "#0A9C72" // deep emerald
];

export const generatePieChartData = (rows: Record<string, any>[]) => {
  return rows.map((row) => {
    const { count, ...rest } = row;
    const labelKey = Object.keys(rest)[0];
    const labelValue = rest[labelKey];

    return {
      name: labelValue,
      value: count
    };
  });
};

export const getGaugeColor = (
  percentage: number,
  thresholds: Array<{ percent: number; color: string }>
) => {
  // Sort thresholds by percent in ascending order
  const sortedThresholds = [...thresholds].sort(
    (a, b) => a.percent - b.percent
  );

  // Find the highest threshold that the percentage is >= to
  let selectedThreshold = sortedThresholds[0]; // default to first threshold

  for (const threshold of sortedThresholds) {
    if (percentage >= threshold.percent) {
      selectedThreshold = threshold;
    } else {
      break;
    }
  }

  return selectedThreshold?.color || COLOR_BANK[0];
};

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
    : COLOR_BANK[0];

  return {
    value: clampedPercentage,
    originalValue: value,
    color: color,
    max: gauge?.max,
    min: gauge?.min,
    label: row.health || row.type || "Value"
  };
};

// Convert column names to display-friendly headers
// Examples: "memory_limit" -> "Memory Limit", "lastUpdated" -> "Last Updated"
export const formatDisplayLabel = (name: string): string => {
  return name
    .replace(/_/g, " ") // Convert underscores to spaces
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Add spaces before capital letters in camelCase
    .replace(/\b\w/g, (l) => l.toUpperCase()); // Capitalize first letter of each word
};
