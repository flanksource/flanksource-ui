import { useForm, Controller } from "react-hook-form";
// import history from "history/browser";

import React, { useEffect } from "react";
import { LayoutDropdown } from "../../Dropdown/LayoutDropdown";
import { GroupByDropdown } from "../../Dropdown/GroupByDropdown";
import { TabByDropdown } from "../../Dropdown/TabByDropdown";
import { Toggle } from "../../Toggle";

import { initialiseFormState, updateFormState, getDefaultForm } from "../state";

import { encodeObjectToUrlSearchParams } from "../url";

import { TristateToggle } from "../../TristateToggle";
import { getFilteredLabelsByChecks } from "../labels";

export function FilterForm({
  labels,
  checks,
  history,
  currentTabChecks = null
}) {
  const searchParams = window.location.search;
  const { formState, fullState } = initialiseFormState(
    getDefaultForm(labels),
    searchParams
  );

  const { control, watch, reset } = useForm({
    defaultValues: formState
  });

  let filteredLabels = labels;
  // only show labels that affect the current list of checks
  if (currentTabChecks && currentTabChecks.length > 0) {
    filteredLabels = getFilteredLabelsByChecks(currentTabChecks, labels);
  }

  useEffect(() => {
    const encoded = encodeObjectToUrlSearchParams(fullState);
    if (window.location.search !== `?${encoded}`) {
      history.push(`${window.location.pathname}?${encoded}`);
      reset(formState);
    }
  }, [formState, fullState, labels, history, reset]);

  const watchLayout = watch("layout");

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
    <form className="relative lg:w-80">
      <div className="mb-8">
        <LayoutDropdown
          control={control}
          name="layout"
          className="mb-4"
          label="Layout"
        />
        {watchLayout === "table" && (
          <GroupByDropdown
            name="groupBy"
            control={control}
            className="mb-4"
            label="Group By"
            checks={checks}
          />
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
        {Object.values(filteredLabels)
          .sort((a, b) => {
            const aLower = a.key.toLowerCase();
            const bLower = b.key.toLowerCase();
            if (aLower < bLower) {
              return -1;
            }
            if (aLower > bLower) {
              return 1;
            }
            return 0;
          })
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
