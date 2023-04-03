import { useField, useFormikContext } from "formik";
import CheckboxCollapsibleGroup from "../../CheckboxCollapsibleGroup/CheckboxCollapsibleGroup";
import FormikCheckbox from "./FormikiCheckbox";
import FormikTextInput from "./FormikTextInput";
import { useEffect } from "react";
import { get, isEmpty } from "lodash";

type FormikConfigEnvVarFieldsProps = {
  name: string;
  label: string;
};

export default function FormikEnvVarConfigsFields({
  name,
  label
}: FormikConfigEnvVarFieldsProps) {
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
        <FormikTextInput name={`${name}.name`} label="Name" />
        <FormikTextInput name={`${name}.value`} label="Value" />
        <div className="flex flex-col space-y-2">
          <label className="font-semibold">Value From</label>
          <div className="flex flex-col p-4 space-y-2">
            <div className="flex flex-col space-y-2">
              <label className="font-semibold">Config Map Key Ref</label>
              <div className="flex flex-col p-4 space-y-2">
                <FormikTextInput
                  name={`${name}.valueFrom.configMapKeyRef.name`}
                  label="Name"
                />
                <FormikTextInput
                  name={`${name}.valueFrom.configMapKeyRef.key`}
                  label="Key"
                />
                <FormikCheckbox
                  name={`${name}.valueFrom.configMapKeyRef.optional`}
                  label="Optional"
                />
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <label className="font-semibold">Secret Key Ref</label>
              <div className="flex flex-col p-4 space-y-2">
                <FormikTextInput
                  name={`${name}.valueFrom.secretKeyRef.name`}
                  label="Name"
                />
                <FormikTextInput
                  name={`${name}.valueFrom.secretKeyRef.key`}
                  label="Key"
                />
                <FormikCheckbox
                  name={`${name}.valueFrom.secretKeyRef.optional`}
                  label="Optional"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </CheckboxCollapsibleGroup>
  );
}
