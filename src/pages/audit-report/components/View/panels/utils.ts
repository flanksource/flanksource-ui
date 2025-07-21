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
  value: number,
  thresholds: Array<{ value: number; color: string }>
) => {
  // Sort thresholds by value in ascending order
  const sortedThresholds = [...thresholds].sort((a, b) => a.value - b.value);

  // Find the appropriate range and return its color
  for (let i = 0; i < sortedThresholds.length; i++) {
    const currentThreshold = sortedThresholds[i];
    const nextThreshold = sortedThresholds[i + 1];

    // If this is the last threshold or value is less than next threshold
    if (!nextThreshold || value < nextThreshold.value) {
      // Value falls in this range if it's >= current threshold
      if (value >= currentThreshold.value) {
        return currentThreshold.color;
      }
    }
  }

  // Default to the first threshold color if value is below all thresholds
  return sortedThresholds[0]?.color || COLOR_BANK[0];
};

export const generateGaugeData = (
  row: Record<string, any>,
  gauge?: GaugeConfig
) => {
  const value = row.value || 0;
  let percentage = 0;
  if (gauge && gauge.max !== gauge.min) {
    percentage = ((value - gauge.min) / (gauge.max - gauge.min)) * 100;
  }
  const clampedPercentage = Math.max(0, Math.min(100, percentage));

  const color = gauge?.thresholds
    ? getGaugeColor(value, gauge.thresholds)
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
