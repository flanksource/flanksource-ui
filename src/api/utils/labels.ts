const quoteJsonPathKey = (key: string) =>
  /[/\\"]/.test(key)
    ? `"${key.replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"`
    : key;

const buildColumnFilter = (
  columnName: string,
  key: string,
  operator: "eq" | "neq",
  value: string
) =>
  `${columnName}->>${quoteJsonPathKey(key)}.${operator}.${encodeURIComponent(value)}`;

export const buildLabelFilterQueries = (
  columnName: string,
  rawValue?: string | null
) => {
  const filterQueries: string[] = [];

  if (!rawValue) {
    return filterQueries;
  }

  rawValue.split(",").forEach((label) => {
    const [filterValue, operand] = label.split(":");
    const [key, value] = filterValue.split("____");
    if (!key || !value) {
      return;
    }

    const operator = parseInt(operand ?? "", 10) === -1 ? "neq" : "eq";
    filterQueries.push(buildColumnFilter(columnName, key, operator, value));
  });

  return filterQueries;
};
