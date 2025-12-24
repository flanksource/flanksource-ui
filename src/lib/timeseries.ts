type ParsedTimestamp = {
  numericValue: number;
  label: string;
};

export function parseTimestamp(value: any, index: number): ParsedTimestamp {
  if (value == null) {
    return { numericValue: index, label: `#${index + 1}` };
  }

  if (value instanceof Date) {
    return { numericValue: value.getTime(), label: value.toISOString() };
  }

  if (typeof value === "number") {
    // Heuristic: values below ~10^11 are likely seconds, convert to ms.
    const numericValue =
      value > 0 && value < 1e11 ? Math.round(value * 1000) : value;
    const dateFromNumber = new Date(numericValue);
    if (!Number.isNaN(dateFromNumber.getTime())) {
      return { numericValue, label: dateFromNumber.toISOString() };
    }
  }

  if (typeof value === "string") {
    // Handle common non-ISO formats like "2025-12-10 12:11:00 +0000 UTC"
    const parsedOriginal = Date.parse(value);
    const parsedNormalized = Date.parse(
      value
        .replace(" UTC", "Z")
        .replace(/\s\+\d{4}\sZ$/, "Z")
        .replace(" ", "T")
    );
    if (!Number.isNaN(parsedOriginal)) {
      const date = new Date(parsedOriginal);
      return { numericValue: date.getTime(), label: date.toISOString() };
    }
    if (!Number.isNaN(parsedNormalized)) {
      const date = new Date(parsedNormalized);
      return { numericValue: date.getTime(), label: date.toISOString() };
    }
  }

  const parsedDate = new Date(value);
  if (!Number.isNaN(parsedDate.getTime())) {
    return { numericValue: parsedDate.getTime(), label: parsedDate.toString() };
  }

  return { numericValue: index, label: String(value) };
}

export function formatTick(
  value: number,
  timeRange: { min: number; max: number; span: number } | null
) {
  if (!Number.isFinite(value)) return "";
  if (!timeRange) return String(value);

  const date = new Date(value);
  const oneDay = 86_400_000;

  if (timeRange.span >= 7 * oneDay) {
    return date.toLocaleDateString(undefined, {
      month: "2-digit",
      day: "2-digit"
    });
  }

  if (timeRange.span >= oneDay) {
    return `${date.toLocaleDateString(undefined, {
      month: "2-digit",
      day: "2-digit"
    })} ${date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    })}`;
  }

  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
}
