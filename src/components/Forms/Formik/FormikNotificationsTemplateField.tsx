import { Switch } from "@flanksource-ui/ui/FormControls/Switch";
import { useField } from "formik";
import { useState } from "react";
import { FormikCodeEditor } from "./FormikCodeEditor";

type Props = {
  name: string;
};

export default function FormikNotificationsTemplateField({ name }: Props) {
  const [field] = useField({
    name
  });

  const value = field.value;

  const [templateOption, setTemplateOption] = useState<
    "Default" | "Custom Template"
  >(() => {
    return value ? "Custom Template" : "Default";
  });

  return (
    <div className="flex flex-col gap-2">
      <label className={`form-label`}>Template</label>
      <div className="flex w-full flex-row">
        <Switch
          options={["Default", "Custom Template"]}
          className="w-auto"
          itemsClassName=""
          defaultValue="Go Template"
          value={templateOption}
          onChange={(v) => {
            setTemplateOption(v);
            // Clear the field if the user selects the default option
            if (v === "Default") {
              field.onChange({
                target: { value: null, name: field.name }
              });
            }
          }}
        />
      </div>
      {templateOption === "Custom Template" && (
        <FormikCodeEditor
          className="flex h-[140px] flex-col"
          fieldName={name}
          format={"markdown"}
        />
      )}
    </div>
  );
}
