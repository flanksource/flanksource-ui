import { useForm, Controller } from "react-hook-form";
// import history from "history/browser";

import React, { useEffect } from "react";
import { LayoutDropdown } from "../../Dropdown/LayoutDropdown";
import { GroupByDropdown } from "../../Dropdown/GroupByDropdown";
import { TabByDropdown } from "../../Dropdown/TabByDropdown";
import { PivotByDropdown } from "../../Dropdown/PivotByDropdown";
import { PivotLabelDropdown } from "../../Dropdown/PivotLabelDropdown";
import { PivotCellTypeDropdown } from "../../Dropdown/PivotCellTypeDropdown";
import { TimeRange } from "../../Dropdown/TimeRange";
import { Toggle } from "../../Toggle";
import { initialiseFormState, updateFormState, getDefaultForm } from "../state";

import { encodeObjectToUrlSearchParams } from "../url";

import { TristateToggle } from "../../TristateToggle";
import { getFilteredLabelsByChecks } from "../labels";

export function FilterForm({
  labels,
  checks,
  history,
  currentTabChecks = null,
  onServerSideFilterChange = null
}) {
  const searchParams = window.location.search;
  const { formState, fullState } = initialiseFormState(
    getDefaultForm(labels),
    searchParams
  );

  const { control, watch, reset } = useForm({
    defaultValues: formState
  });
  let filteredLabels =
    currentTabChecks && currentTabChecks.length > 0
      ? getFilteredLabelsByChecks(currentTabChecks, labels)
      : labels;

  filteredLabels = Object.values(filteredLabels);

  filteredLabels = filteredLabels.sort((a, b) => {
    const aLower = a.key.toLowerCase();
    const bLower = b.key.toLowerCase();
    if (aLower < bLower) {
      return -1;
    }
    if (aLower > bLower) {
      return 1;
    }
    return 0;
  });
  useEffect(() => {
    const encoded = encodeObjectToUrlSearchParams(fullState);
    if (window.location.search !== `?${encoded}`) {
      history.push(`${window.location.pathname}?${encoded}`);
      reset(formState);
    }
  }, [formState, fullState, labels, history, reset]);

  useEffect(() => {
    if (onServerSideFilterChange != null) {
      onServerSideFilterChange();
    }
  }, [formState.timeRange, onServerSideFilterChange]);

  const watchLayout = watch("layout");
  const watchPivotBy = watch("pivotBy");

  useEffect(() => {
    const watchAll = watch((data) => {
      const searchParams = window.location.search;
      const { formState } = updateFormState(data, searchParams, labels);
      const encoded = encodeObjectToUrlSearchParams(formState);
      if (window.location.search !== `?${encoded}`) {
        // See https://github.com/remix-run/history/blob/main/docs/getting-started.md
        history.push(`${window.location.pathname}?${encoded}`);
      }
    });
    return () => {
      watchAll.unsubscribe();
    };
  });
  return (
    <form className="relative">
      <div className="mb-8">
        <TimeRange
          control={control}
          name="timeRange"
          className="mb-4"
          label="Time Range"
        />

        <LayoutDropdown
          control={control}
          name="layout"
          className="mb-4"
          label="Layout"
        />

        {watchLayout === "table" && (
          <>
            <GroupByDropdown
              name="groupBy"
              control={control}
              className="mb-4"
              label="Group By"
              checks={checks}
            />
            <PivotByDropdown
              name="pivotBy"
              control={control}
              className="mb-4"
              label="Pivot By"
              checks={checks}
            />
            {watchPivotBy === "labels" && (
              <PivotLabelDropdown
                name="pivotLabel"
                control={control}
                className="mb-4"
                label="Pivot Label"
                checks={checks}
              />
            )}
            {watchPivotBy !== "none" && (
              <PivotCellTypeDropdown
                name="pivotCellType"
                control={control}
                className="mb-4"
                label="Cell Type"
                checks={checks}
              />
            )}
          </>
        )}
        <TabByDropdown
          name="tabBy"
          control={control}
          className="mb-4"
          label="Tab By"
          checks={checks}
        />
      </div>

      <div className="uppercase font-semibold text-sm mb-3 text-indigo-700">
        Filter By Health
      </div>
      <Controller
        key="hidePassing"
        name="hidePassing"
        control={control}
        render={({ field: { ref, ...rest } }) => (
          <Toggle label="Hide Passing" className="mb-3" {...rest} />
        )}
      />

      <div className="mt-8">
        <div className="uppercase font-semibold text-sm mb-3 text-indigo-700">
          Filter By Label
        </div>
        {filteredLabels
          .filter((o) => o && o !== undefined)
          .map((label) => (
            <Controller
              key={label.id}
              name={`labels.${label.id}`}
              control={control}
              render={({ field: { ref, ...rest } }) => (
                <TristateToggle
                  key={label.key}
                  className="mb-2"
                  label={label}
                  {...rest}
                />
              )}
            />
          ))}
      </div>
    </form>
  );
}
