import { HealthCheck } from "../../../api/types/health";
import { isPlainObject } from "../../../lib/isPlainObject";
import { aggregate } from "../aggregate";
import { GetName } from "../data";
import { removeNamespacePrefix } from "../utils";

export function makeRow({
  row = {},
  hideNamespacePrefix = true
}: {
  row: any;
  hideNamespacePrefix?: boolean;
}) {
  return {
    ...row,
    name: GetName(row),
    sourceName: row?.name ?? "",
    sortKey: hideNamespacePrefix
      ? removeNamespacePrefix(GetName(row), row)
      : GetName(row)
  };
}

export function filterRowsByPivotSet(rows: any, pivotSet: any) {
  return Array.from(pivotSet).reduce(
    (accPivots: any, pivot: any) => {
      const filteredRows = rows.reduce((acc: any, row: any) => {
        if (row[pivot] != null) {
          acc[acc.length] = row[pivot];
        }
        return acc;
      }, []);
      if (filteredRows.length > 0) {
        accPivots[pivot] = aggregate(pivot, filteredRows);
      }
      return accPivots;
    },
    {} as Record<string, any>
  );
}

export function prepareRows({
  tableData = [],
  hideNamespacePrefix = true,
  pivotBy = null,
  pivotLookup = null
}: {
  tableData?: HealthCheck[];
  hideNamespacePrefix?: boolean;
  pivotBy?: string | null;
  pivotLookup?: string | null;
}) {
  if (pivotBy == null || pivotBy === "none") {
    const values = tableData?.reduce(
      (acc: any, row, i) => {
        acc.rows[i] = makeRow({ row, hideNamespacePrefix });
        return acc;
      },
      { meta: { pivoted: false, pivotSet: new Set(), pivotBy }, rows: [] }
    );

    return values;
  }
  if (pivotBy != null && pivotBy !== "none") {
    const values = tableData.reduce(
      (acc: any, row: any) => {
        const {
          rows: { length }
        } = acc;
        const hasPivot = row[pivotBy] != null && row[pivotBy] !== "";
        const pivotValue = row[pivotBy];
        const isAggregate = row.isAggregate != null && row.isAggregate === true;
        const pivotValueIsObject = isPlainObject(pivotValue);
        if (isAggregate) {
          acc.meta.pivotSet.add("piv0t-aggregate");
          const subRows =
            row?.subRows != null
              ? prepareRows({
                  tableData: row.subRows,
                  hideNamespacePrefix,
                  pivotBy,
                  pivotLookup
                })
              : [];
          if (subRows.rows.length === 0) {
            return acc;
          }
          subRows.meta.pivotSet.forEach((value: any) => {
            acc.meta.pivotSet.add(value);
          });
          const newRow = { ...row, subRows: subRows.rows };
          const aggregateFilters: any = filterRowsByPivotSet(
            subRows.rows,
            acc.meta.pivotSet
          );
          acc.rows[length] = {
            valueLookup: "piv0t-aggregate",
            pivoted: true,
            "piv0t-aggregate": makeRow({ row: newRow, hideNamespacePrefix }),
            ...aggregateFilters
          };
        }
        if (hasPivot && pivotValueIsObject === false) {
          acc.meta.pivotSet.add(`piv0t-${pivotValue}`);
          acc.rows[length] = {
            valueLookup: `piv0t-${pivotValue}`,
            pivoted: true,
            [`piv0t-${pivotValue}`]: makeRow({ row, hideNamespacePrefix })
          };
        }
        if (hasPivot && pivotValueIsObject) {
          const {
            rows: { length }
          } = acc;
          const pivotObjectIsEmpty = Object.keys(pivotValue).length === 0;
          if (pivotObjectIsEmpty === false) {
            const keyObject = Object.entries(pivotValue).reduce(
              (keyObjectAcc, [k, v]) => {
                if (k === pivotLookup) {
                  acc.meta.pivotSet.add(`piv0t-${v}`);
                  keyObjectAcc[`piv0t-${v}`] = makeRow({
                    row,
                    hideNamespacePrefix
                  });
                }
                return keyObjectAcc;
              },
              {} as Record<string, any>
            );
            if (Object.keys(keyObject).length === 0) {
              return acc;
            }
            acc.rows[length] = {
              // It doesn't matter what the lookup is since they're identical
              valueLookup: Object.keys(keyObject)[0],
              pivoted: true,
              ...keyObject
            };
          }
        }
        if (hasPivot === false && isAggregate === false) {
          acc.meta.pivotSet.add("piv0t-other");
          acc.rows[length] = {
            valueLookup: "piv0t-other",
            pivoted: true,
            "piv0t-other": makeRow({ row, hideNamespacePrefix })
          };
        }

        return acc;
      },
      {
        meta: {
          pivoted: true,
          pivotSet: new Set(["piv0t-aggregate"]),
          pivotBy
        },
        rows: []
      }
    );
    const {
      meta: { pivotSet }
    } = values;
    if (pivotSet.has("piv0t-other")) {
      // Set iteration is by order of insertion, so this forces other to end.
      // By starting with "piv0t-aggregate" above, we force it to the start.
      pivotSet.delete("piv0t-other");
      pivotSet.add("piv0t-other");
    }
    return values;
  }
  return {
    meta: { pivoted: true, pivotSet: new Set(), pivotBy },
    rows: []
  };
}
