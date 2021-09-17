import { useForm, Controller } from "react-hook-form";
// import history from "history/browser";

import React, { useEffect } from "react";
import { LayoutDropdown } from "../../Dropdown/LayoutDropdown";
import { GroupByDropdown } from "../../Dropdown/GroupByDropdown";
import { Toggle } from "../../Toggle";

import { initialiseFormState, updateFormState, getDefaultForm } from "../state";

import { encodeObjectToUrlSearchParams } from "../url";

import { TristateToggle } from "../../TristateToggle";

export function FilterForm({ labels, checks, history }) {
  const searchParams = window.location.search;
  const { formState, fullState } = initialiseFormState(
    getDefaultForm(labels),
    searchParams
  );

  const { control, watch, reset } = useForm({
    defaultValues: formState
  });

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
        {Object.values(labels).map((label) => (
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
