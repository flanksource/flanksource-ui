import {
  prepareRows,
  makeRow,
  filterRowsByPivotSet
} from "../../../components/Canary/Rows/lib";
import { subsetOne } from "../../../data/testData";
import { getAggregatedGroupedChecks } from "../../../components/Canary/aggregate";
import { getGroupedChecks } from "../../../components/Canary/grouping";
import { isPlainObject } from "../../../lib/isPlainObject";

describe("prepareRows", () => {
  it("prepareRows({ tableData[noGrouping] }) => { meta[empty], rows: [ { ...check } ]}", () => {
    const { rows, meta } = prepareRows({
      tableData: subsetOne
    });
    rows.forEach((obj, i) =>
      expect(obj).toEqual(makeRow({ row: subsetOne[i] }))
    );
    expect(meta.pivotSet).toEqual(new Set());
    expect(meta.pivotBy).toBe(null);
    expect(meta.pivoted).toBe(false);
  });

  it("prepareRows({ tableData[noGrouping], pivotBy }) => { meta[filled], rows: [ { pivoted: true, [pivot]: { ...check } ]}", () => {
    const pivotBy = "namespace";
    const { rows, meta } = prepareRows({
      tableData: subsetOne,
      pivotBy
    });

    rows.forEach((obj, i) => {
      const pivot =
        subsetOne[i].namespace !== ""
          ? (`piv0t-${subsetOne[i].namespace}` ?? "piv0t-other")
          : "piv0t-other";
      expect(obj).toEqual({
        valueLookup: pivot,
        pivoted: true,
        [pivot]: makeRow({ row: subsetOne[i] })
      });
    });
    expect(meta.pivotSet).toEqual(
      new Set([
        "piv0t-aggregate",
        "piv0t-demo",
        "piv0t-nametest",
        "piv0t-other"
      ])
    );
    expect(meta.pivotBy).toBe(pivotBy);
    expect(meta.pivoted).toBe(true);
  });

  it("prepareRows({ tableData[noGrouping], pivotBy, hideNamespacePrefix: false }) => { meta[filled], rows: [ { pivoted: true, [pivot]: { ...check } ]}", () => {
    const pivotBy = "namespace";
    const { rows, meta } = prepareRows({
      tableData: subsetOne,
      pivotBy,
      hideNamespacePrefix: false
    });

    rows.forEach((obj, i) => {
      const pivot =
        subsetOne[i].namespace !== ""
          ? (`piv0t-${subsetOne[i].namespace}` ?? "piv0t-other")
          : "piv0t-other";
      expect(obj).toEqual({
        valueLookup: pivot,
        pivoted: true,
        [pivot]: makeRow({ row: subsetOne[i], hideNamespacePrefix: false })
      });
    });
    expect(meta.pivotSet).toEqual(
      new Set([
        "piv0t-aggregate",
        "piv0t-demo",
        "piv0t-nametest",
        "piv0t-other"
      ])
    );
    expect(meta.pivotBy).toBe(pivotBy);
    expect(meta.pivoted).toBe(true);
  });

  it("prepareRows({ tableData[groupBy='name'], pivotBy: 'namespace', hideNamespacePrefix: false }) => { meta[filled], rows: [ { ...check, subRows[transformed] } ]}", () => {
    const pivotBy = "namespace";
    const hideNamespacePrefix = false;
    const subsetMap = subsetOne.reduce((acc, curr) => {
      acc[curr.name ?? ""] = curr;
      return acc;
    }, {});
    const aggregateChecks = getAggregatedGroupedChecks(
      getGroupedChecks(subsetOne, "name"),
      false
    );
    const values = Object.values(aggregateChecks);

    const { rows, meta } = prepareRows({
      tableData: values,
      pivotBy,
      hideNamespacePrefix
    });
    rows.forEach((obj) => {
      const isAggregate =
        obj["piv0t-aggregate"]?.isAggregate != null &&
        obj["piv0t-aggregate"]?.isAggregate === true;

      if (isAggregate) {
        const aggObj = obj["piv0t-aggregate"];
        const { sourceName } = aggObj;
        const groupedValue = aggregateChecks[sourceName] ?? {};
        const sourceSubRows = groupedValue?.subRows ?? [];
        const { rows: subRows } = prepareRows({
          tableData: sourceSubRows,
          pivotBy,
          hideNamespacePrefix
        });
        const newRow = { ...groupedValue, subRows };
        const aggregateFilters = filterRowsByPivotSet(
          subRows,
          new Set([
            "piv0t-aggregate",
            "piv0t-demo",
            "piv0t-nametest",
            "piv0t-other"
          ])
        );
        const testRow = {
          valueLookup: "piv0t-aggregate",
          pivoted: true,
          "piv0t-aggregate": makeRow({ row: newRow, hideNamespacePrefix }),
          ...aggregateFilters
        };
        // eslint-disable-next-line jest/no-conditional-expect
        expect(obj).toEqual(testRow);
      } else {
        const value =
          obj?.pivoted === true ? (obj[obj?.valueLookup] ?? null) : obj;
        const sourceObj = subsetMap[value?.sourceName] ?? {};
        const pivot =
          sourceObj.namespace !== ""
            ? (`piv0t-${sourceObj.namespace}` ?? "piv0t-other")
            : "piv0t-other";
        // eslint-disable-next-line jest/no-conditional-expect
        expect(obj).toEqual({
          valueLookup: pivot,
          pivoted: true,
          [pivot]: makeRow({ row: sourceObj, hideNamespacePrefix: false })
        });
      }
    });
    expect(meta.pivotSet).toEqual(
      new Set([
        "piv0t-aggregate",
        "piv0t-demo",
        "piv0t-nametest",
        "piv0t-other"
      ])
    );
    expect(meta.pivotBy).toBe("namespace");
    expect(meta.pivoted).toBe(true);
  });

  it("prepareRows({ tableData[groupBy='name'], pivotBy: 'labels', pivotLookup: 'test', hideNamespacePrefix: false }) => { meta[filled], rows: [ { ...check, subRows[transformed] } ]}", () => {
    const pivotBy = "labels";
    const hideNamespacePrefix = false;
    const pivotLookup = "test";
    const subsetMap = subsetOne.reduce((acc, curr) => {
      acc[curr.name ?? ""] = curr;
      return acc;
    }, {});
    const aggregateChecks = getAggregatedGroupedChecks(
      getGroupedChecks(subsetOne, "name"),
      false
    );

    const values = Object.values(aggregateChecks);

    const { rows, meta } = prepareRows({
      tableData: values,
      pivotBy,
      hideNamespacePrefix,
      pivotLookup
    });
    rows.forEach((obj) => {
      const isAggregate =
        obj["piv0t-aggregate"]?.isAggregate != null &&
        obj["piv0t-aggregate"]?.isAggregate === true;

      if (isAggregate) {
        const aggObj = obj["piv0t-aggregate"];
        const { sourceName } = aggObj;
        const groupedValue = aggregateChecks[sourceName] ?? {};
        const sourceSubRows = groupedValue?.subRows ?? [];
        const { rows: subRows } = prepareRows({
          tableData: sourceSubRows,
          pivotBy,
          hideNamespacePrefix,
          pivotLookup
        });

        const newRow = { ...groupedValue, subRows };
        const aggregateFilters = filterRowsByPivotSet(
          subRows,
          new Set(["piv0t-aggregate", "piv0t-istest", "piv0t-istest2"])
        );

        // eslint-disable-next-line jest/no-conditional-expect
        const testRow = {
          valueLookup: "piv0t-aggregate",
          pivoted: true,
          "piv0t-aggregate": makeRow({ row: newRow, hideNamespacePrefix }),
          ...aggregateFilters
        };
        // eslint-disable-next-line jest/no-conditional-expect
        expect(obj).toEqual(testRow);
      } else {
        const value =
          obj?.pivoted === true ? (obj[obj?.valueLookup] ?? null) : obj;
        const sourceObj = subsetMap[value?.sourceName] ?? {};
        const isLabelsPlainObject = isPlainObject(sourceObj.labels);
        if (
          isLabelsPlainObject
            ? Object.keys(sourceObj.labels).length === 0
            : false
        ) {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(obj).toEqual({
            valueLookup: "piv0t-none",
            pivoted: true,
            "piv0t-none": makeRow({
              row: sourceObj,
              hideNamespacePrefix: false
            })
          });
        }
        if (
          isLabelsPlainObject ? Object.keys(sourceObj.labels).length > 0 : false
        ) {
          const keyObject = Object.entries(sourceObj.labels).reduce(
            (acc, [k, v]) => {
              if (k === pivotLookup) {
                new Set([
                  "piv0t-aggregate",
                  "piv0t-istest",
                  "piv0t-istest2"
                ]).add(`piv0t-${v}`);
                acc[`piv0t-${v}`] = makeRow({
                  row: sourceObj,
                  hideNamespacePrefix
                });
              }
              return acc;
            },
            {}
          );

          const newRow = {
            valueLookup: Object.keys(keyObject)[0],
            pivoted: true,
            ...keyObject
          };

          // eslint-disable-next-line jest/no-conditional-expect
          expect(obj).toEqual(newRow);
        }
      }
    });
    expect(meta.pivotSet).toEqual(
      new Set(["piv0t-aggregate", "piv0t-istest", "piv0t-istest2"])
    );
    expect(meta.pivotBy).toBe("labels");
    expect(meta.pivoted).toBe(true);
  });
});
