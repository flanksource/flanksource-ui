import FormikCanaryDropdown from "@flanksource-ui/components/Forms/Formik/FormikCanaryDropdown";
import FormikConnectionField from "@flanksource-ui/components/Forms/Formik/FormikConnectionField";
import FormikPlaybooksDropdown from "@flanksource-ui/components/Forms/Formik/FormikPlaybooksDropdown";
import FormikResourceSelectorDropdown from "@flanksource-ui/components/Forms/Formik/FormikResourceSelectorDropdown";
import { Switch } from "@flanksource-ui/ui/FormControls/Switch";
import { useFormikContext } from "formik";
import { useState } from "react";

export default function FormikPermissionSelectResourceFields() {
  const { setFieldValue } = useFormikContext<Record<string, any>>();

  const [switchOption, setSwitchOption] = useState<
    "Component" | "Catalog" | "Canary" | "Playbook" | "Connection"
  >("Catalog");

  return (
    <div className="flex flex-col gap-2">
      <label className={`form-label`}>Resource</label>
      <div>
        <div className="flex w-full flex-row">
          <Switch
            options={["Catalog", "Component", "Connection", "Playbook"]}
            className="w-auto"
            itemsClassName=""
            defaultValue="Go Template"
            value={switchOption}
            onChange={(v) => {
              setSwitchOption(v);
              setFieldValue("config_id", undefined);
              setFieldValue("check_id", undefined);
              setFieldValue("canary_id", undefined);
              setFieldValue("component_id", undefined);
              setFieldValue("playbook_id", undefined);
            }}
          />
        </div>

        {switchOption === "Catalog" && (
          <FormikResourceSelectorDropdown
            required
            name="config_id"
            configResourceSelector={[{}]}
          />
        )}

        {switchOption === "Component" && (
          <FormikResourceSelectorDropdown
            required
            name="component_id"
            componentResourceSelector={[{}]}
          />
        )}

        {switchOption === "Playbook" && (
          <FormikPlaybooksDropdown required name="playbook_id" />
        )}

        {switchOption === "Canary" && (
          <FormikCanaryDropdown required name="canary_id" />
        )}

        {switchOption === "Connection" && (
          <FormikConnectionField required name="connection_id" />
        )}
      </div>
    </div>
  );
}
