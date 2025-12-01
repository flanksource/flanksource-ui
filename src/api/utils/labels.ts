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
    filterQueries.push(
      `${columnName}->>${key}.${operator}.${encodeURIComponent(value)}`
    );
  });

  return filterQueries;
};
