import FormikResourceSelectorDropdown from "@flanksource-ui/components/Forms/Formik/FormikResourceSelectorDropdown";
import { useConfigHardParents } from "@flanksource-ui/api/query-hooks/useConfigRelationshipsQuery";
import { Label } from "@flanksource-ui/ui/FormControls/Label";
import { Switch } from "@flanksource-ui/ui/FormControls/Switch";
import { useFormikContext } from "formik";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function FormikNotificationResourceField() {
  const [searchParam] = useSearchParams();
  const prepopulatedConfigID = searchParam.get("config_id") ?? undefined;

  const { values, setFieldValue } = useFormikContext<Record<string, any>>();

  const component_id = values.component_id;
  const config_id = values.config_id;
  const check_id = values.check_id;
  const canary_id = values.canary_id;

  const [switchOption, setSwitchOption] = useState<
    "Component" | "Catalog" | "Check" | "Canary"
  >(() => {
    if (component_id) {
      return "Component";
    }
    if (config_id) {
      return "Catalog";
    }
    if (check_id) {
      return "Check";
    }
    if (canary_id) {
      return "Canary";
    }
    return "Catalog";
  });

  const fieldName = useMemo(() => {
    switch (switchOption) {
      case "Component":
        return {
          name: "component_id",
          label: "Component"
        };
      case "Catalog":
        return {
          name: "config_id",
          label: "Catalog"
        };
      case "Check":
        return {
          name: "check_id",
          label: "Check"
        };
      case "Canary":
        return {
          name: "canary_id",
          label: "Canary"
        };
    }
  }, [switchOption]);

  const { data: hardParents } = useConfigHardParents(
    prepopulatedConfigID || ""
  );

  return (
    <div className="flex flex-col gap-2">
      <Label label="Resource" required={true} />
      <div>
        <div className="flex w-full flex-row">
          <Switch
            options={["Catalog", "Component", "Check"]}
            className="w-auto"
            itemsClassName=""
            defaultValue="Go Template"
            value={switchOption}
            onChange={(v) => {
              setSwitchOption(v);
              // clear the other fields if the user selects a different option
              if (v === "Component") {
                values.config_id = null;
                values.check_id = null;
                values.canary_id = null;
              }

              if (v === "Catalog") {
                values.component_id = null;
                values.check_id = null;
                values.canary_id = null;
              }

              if (v === "Check") {
                values.component_id = null;
                values.config_id = null;
                values.canary_id = null;
              }

              if (v === "Canary") {
                values.component_id = null;
                values.config_id = null;
                values.check_id = null;
              }
            }}
          />
        </div>

        <FormikResourceSelectorDropdown
          name={fieldName.name}
          checkResourceSelector={
            switchOption === "Check" ? [{ id: check_id }] : undefined
          }
          componentResourceSelector={
            switchOption === "Component"
              ? [
                  {
                    id: component_id
                  }
                ]
              : undefined
          }
          configResourceSelector={
            switchOption === "Catalog"
              ? [
                  {
                    id: config_id
                  }
                ]
              : undefined
          }
        />

        {hardParents && (
          <>
            <Label label="Silent its parent instead" />
            {hardParents
              ?.filter((parent) => parent.id !== config_id)
              .sort((a, b) => (a?.path?.length ?? 0) - (b?.path?.length ?? 0)) // higher level first in the list
              .map((parent) => (
                <label
                  key={parent.id}
                  title={parent.name}
                  aria-label={parent.name}
                  aria-description={parent.type || ""}
                  onChange={() => setFieldValue("parent_config", parent.id)}
                  className="group flex cursor-pointer border border-gray-200 p-4 first:rounded-tl-md first:rounded-tr-md last:rounded-bl-md last:rounded-br-md focus:outline-none has-[:checked]:relative has-[:checked]:border-indigo-200 has-[:checked]:bg-indigo-50"
                >
                  <input
                    defaultValue={parent.name}
                    defaultChecked={false}
                    value={parent.id}
                    name="parent"
                    type="radio"
                    className="relative mt-0.5 size-4 shrink-0 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden [&:not(:checked)]:before:hidden"
                  />
                  <span className="ml-3 flex flex-col">
                    <span className="block text-sm font-medium text-gray-900 group-has-[:checked]:text-indigo-900">
                      {parent.name}
                    </span>
                    <span className="block text-sm text-gray-500 group-has-[:checked]:text-indigo-700">
                      {parent.type}
                    </span>
                  </span>
                </label>
              ))}
          </>
        )}
      </div>
    </div>
  );
}
