import FormikResourceSelectorDropdown from "@flanksource-ui/components/Forms/Formik/FormikResourceSelectorDropdown";
import { Switch } from "@flanksource-ui/ui/FormControls/Switch";
import { useFormikContext } from "formik";
import { useMemo, useState } from "react";

export default function FormikNotificationResourceField() {
  const { values } = useFormikContext<Record<string, any>>();

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

  return (
    <div className="flex flex-col gap-2">
      <label className={`form-label`}>Resource</label>
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
          required
          name={fieldName.name}
          checkResourceSelector={switchOption === "Check" ? [{}] : undefined}
          componentResourceSelector={
            switchOption === "Component" ? [{}] : undefined
          }
          configResourceSelector={switchOption === "Catalog" ? [{}] : undefined}
        />
      </div>
    </div>
  );
}
