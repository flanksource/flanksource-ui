import { OnChangeFn, RowSelectionState, Updater } from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useState } from "react";

export type BulkSelectionState<S> =
  | {
      mode: "selective";
      includedIds: Set<string>;
    }
  | {
      mode: "all";
      selectionScope: S;
    }
  | {
      mode: "allExcept";
      selectionScope: S;
      excludedIds: Set<string>;
    };

export type BulkSelectionPayload<S> =
  | { mode: "selective"; ids: string[] }
  | { mode: "all"; ids: string[]; selectionScope: S }
  | { mode: "allExcept"; ids: string[]; selectionScope: S };

type UseMrtBulkSelectionOptions<T, S> = {
  rows: T[];
  totalRowCount: number;
  getRowId: (row: T) => string;
  selectionScope: S;
  resetKey?: string;
};

const emptyBulkSelection = <S>(): BulkSelectionState<S> => ({
  mode: "selective",
  includedIds: new Set<string>()
});

function isIdSelected<S>(state: BulkSelectionState<S>, id: string) {
  if (state.mode === "selective") {
    return state.includedIds.has(id);
  }

  if (state.mode === "all") {
    return true;
  }

  return !state.excludedIds.has(id);
}

function selectId<S>(
  state: BulkSelectionState<S>,
  id: string
): BulkSelectionState<S> {
  if (state.mode === "selective") {
    const next = new Set(state.includedIds);
    next.add(id);
    return {
      mode: "selective",
      includedIds: next
    };
  }

  if (state.mode === "all") {
    return state;
  }

  const next = new Set(state.excludedIds);
  next.delete(id);

  if (next.size === 0) {
    return {
      mode: "all",
      selectionScope: state.selectionScope
    };
  }

  return {
    mode: "allExcept",
    selectionScope: state.selectionScope,
    excludedIds: next
  };
}

function deselectId<S>(
  state: BulkSelectionState<S>,
  id: string
): BulkSelectionState<S> {
  if (state.mode === "selective") {
    const next = new Set(state.includedIds);
    next.delete(id);
    return {
      mode: "selective",
      includedIds: next
    };
  }

  if (state.mode === "all") {
    return {
      mode: "allExcept",
      selectionScope: state.selectionScope,
      excludedIds: new Set([id])
    };
  }

  const next = new Set(state.excludedIds);
  next.add(id);
  return {
    mode: "allExcept",
    selectionScope: state.selectionScope,
    excludedIds: next
  };
}

function countSelectedRows<S>(
  state: BulkSelectionState<S>,
  totalEntries: number
) {
  if (state.mode === "selective") {
    return state.includedIds.size;
  }

  if (state.mode === "all") {
    return totalEntries;
  }

  return Math.max(totalEntries - state.excludedIds.size, 0);
}

export default function useMrtBulkSelection<T, S>({
  rows,
  totalRowCount,
  getRowId,
  selectionScope,
  resetKey
}: UseMrtBulkSelectionOptions<T, S>) {
  const [bulkSelection, setBulkSelection] = useState<BulkSelectionState<S>>(
    emptyBulkSelection<S>
  );

  useEffect(() => {
    if (resetKey === undefined) {
      return;
    }

    setBulkSelection(emptyBulkSelection<S>());
  }, [resetKey]);

  const rowSelection = useMemo<RowSelectionState>(() => {
    return rows.reduce<RowSelectionState>((acc, row) => {
      const id = getRowId(row);
      if (id && isIdSelected(bulkSelection, id)) {
        acc[id] = true;
      }
      return acc;
    }, {});
  }, [bulkSelection, getRowId, rows]);

  const selectedCount = useMemo(
    () => countSelectedRows(bulkSelection, totalRowCount),
    [bulkSelection, totalRowCount]
  );

  const hasSelectedRows = selectedCount > 0;

  const selectionSummary =
    bulkSelection.mode === "all"
      ? `All ${selectedCount} selected`
      : bulkSelection.mode === "allExcept"
        ? `All selected except ${bulkSelection.excludedIds.size}`
        : `${selectedCount} selected`;

  const onRowSelectionChange = useCallback<OnChangeFn<RowSelectionState>>(
    (updater: Updater<RowSelectionState>) => {
      const nextRowSelection =
        typeof updater === "function" ? updater(rowSelection) : updater;

      setBulkSelection((previous) => {
        let nextState = previous;

        rows.forEach((row) => {
          const id = getRowId(row);
          if (!id) {
            return;
          }

          const wasSelected = isIdSelected(nextState, id);
          const isSelectedNow = !!nextRowSelection[id];

          if (wasSelected === isSelectedNow) {
            return;
          }

          nextState = isSelectedNow
            ? selectId(nextState, id)
            : deselectId(nextState, id);
        });

        return nextState;
      });
    },
    [getRowId, rowSelection, rows]
  );

  const onSelectAllChange = useCallback(
    (checked: boolean) => {
      if (checked) {
        setBulkSelection({
          mode: "all",
          selectionScope
        });
        return;
      }

      setBulkSelection(emptyBulkSelection<S>());
    },
    [selectionScope]
  );

  const clearSelection = useCallback(() => {
    setBulkSelection(emptyBulkSelection<S>());
  }, []);

  const buildPayload = useCallback((): BulkSelectionPayload<S> => {
    if (bulkSelection.mode === "selective") {
      return {
        mode: "selective",
        ids: Array.from(bulkSelection.includedIds)
      };
    }

    if (bulkSelection.mode === "all") {
      return {
        mode: "all",
        ids: [],
        selectionScope: bulkSelection.selectionScope
      };
    }

    return {
      mode: "allExcept",
      ids: Array.from(bulkSelection.excludedIds),
      selectionScope: bulkSelection.selectionScope
    };
  }, [bulkSelection]);

  return {
    bulkSelection,
    rowSelection,
    selectedCount,
    hasSelectedRows,
    selectionSummary,
    onRowSelectionChange,
    onSelectAllChange,
    clearSelection,
    buildPayload
  };
}
