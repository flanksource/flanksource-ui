/**
 * Names the series a timeseries row belongs to, using whichever of its columns are
 * neither the time nor the value.
 */
export function buildSeriesKey(
  row: Record<string, any>,
  timeKey: string,
  valueKey: string
): string {
  const labelKeys = Object.keys(row).filter(
    (key) => key !== timeKey && key !== valueKey
  );

  // A single label column already names the series on its own, so the column name adds
  // nothing to the legend — "service=Compute Engine" reads as debug output where
  // "Compute Engine" reads as a label. With more than one, the names are what keep the
  // combination unambiguous, so they stay.
  if (labelKeys.length === 1) {
    const value = row[labelKeys[0]];
    if (value != null && String(value) !== "") {
      return String(value);
    }
  }

  return labelKeys.map((key) => `${key}=${row[key]}`).join(", ") || "default";
}
