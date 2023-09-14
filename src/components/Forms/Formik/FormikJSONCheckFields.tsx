import { useFormikContext, useField } from "formik";
import { isEmpty, get } from "lodash";
import { useEffect } from "react";
import CheckboxCollapsibleGroup from "../../CheckboxCollapsibleGroup/CheckboxCollapsibleGroup";
import FormikTextInput from "./FormikTextInput";

type FormikJSONCheckFieldsProps = {
  name: string;
  label: string;
};

export default function FormikJSONCheckFields({
  name,
  label
}: FormikJSONCheckFieldsProps) {
  const { setFieldValue, values } = useFormikContext<Record<string, any>>();

  const [field] = useField(name);

  const { value } = field;

  // remove empty fields
  useEffect(() => {
    if (values) {
      const fields = name.split(".");
      let current = fields[0];
      for (let i = 1; i < fields.length; i++) {
        // if any of the current fields parent is empty, remove it
        if (isEmpty(get(values, current))) {
          setFieldValue(current, undefined);
          break;
        }
        current = `${current}.${fields[i]}`;
      }
    }
  }, [name, setFieldValue, values]);

  return (
    <CheckboxCollapsibleGroup
      label={label}
      isChecked={!!value || false}
      onChange={(v) => {
        if (!v) {
          setFieldValue(name, undefined);
        }
      }}
    >
      <div className="flex flex-col p-4 space-y-2 border border-gray-200 rounded-md">
        <FormikTextInput name={`${name}.path`} label="Path" />
        <FormikTextInput name={`${name}.value`} label="Value" />
      </div>
    </CheckboxCollapsibleGroup>
  );
}
