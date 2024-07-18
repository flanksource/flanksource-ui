import { useField, useFormikContext } from "formik";
import { useMemo, useState } from "react";
import { Switch } from "../../../ui/FormControls/Switch";
import { FormikCodeEditor } from "./FormikCodeEditor";

const LanguageOptionsForTemplate = {
  None: "none",
  "Go Template": "template",
  Javascript: "javascript",
  Expr: "expr",
  JSONPath: "jsonpath"
};

type FormikTemplateFieldsProps = {
  name: string;
  label: string;
};

export default function FormikTemplateFields({
  name,
  label
}: FormikTemplateFieldsProps) {
  const { setFieldValue } = useFormikContext<Record<string, any>>();

  const [field] = useField(name);

  const [selectedOption, setSelectedOptions] = useState<
    keyof typeof LanguageOptionsForTemplate
  >(() => {
    if (field.value) {
      if (field.value.template) {
        return "Go Template";
      }
      if (field.value.javascript) {
        return "Javascript";
      }
      if (field.value.expr) {
        return "Expr";
      }
      if (field.value.jsonpath) {
        return "JSONPath";
      }
    }
    return "None";
  });

  const fieldName = useMemo(() => {
    if (selectedOption) {
      if (selectedOption === "None") {
        return undefined;
      }
      return `${name}.${LanguageOptionsForTemplate[selectedOption]}`;
    }
  }, [name, selectedOption]);

  const language = useMemo(() => {
    switch (selectedOption) {
      case "Go Template":
        return "go";
      case "Javascript":
        return "javascript";
      case "Expr":
        return "expr";
      case "JSONPath":
        return "jsonpath";
      default:
        return undefined;
    }
  }, [selectedOption]);

  return (
    <div className="flex flex-col space-y-2 py-2">
      <label className="text-sm font-semibold">{label}</label>
      <div className="flex w-full flex-row">
        <Switch
          options={Object.keys(LanguageOptionsForTemplate).map(
            (value) => value
          )}
          className="w-auto"
          itemsClassName=""
          defaultValue="Go Template"
          value={selectedOption}
          onChange={(v) => {
            if (v !== selectedOption && fieldName) {
              setFieldValue(fieldName, undefined);
            }
            setSelectedOptions(v as any);
          }}
        />
      </div>
      {fieldName && (
        <FormikCodeEditor
          fieldName={fieldName}
          className="h-32"
          format={language}
        />
      )}
    </div>
  );
}
