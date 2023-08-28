import { getIn, useFormikContext } from "formik";
import { useEffect } from "react";
import FormikAuthFields from "../Formik/FormikAuthFields";
import FormikCheckboxFieldsGroup from "../Formik/FormikCheckboxFieldsGroup";
import FormikIconPicker from "../Formik/FormikIconPicker";
import FormikScheduleField from "../Formik/FormikScheduleField";
import FormikTemplateFields from "../Formik/FormikTemplateFields";
import FormikTextInput from "../Formik/FormikTextInput";

type AlertmanagerHealthFormEditorProps = {
  fieldName: string;
  specsMapField: string;
};

export function AlertmanagerHealthFormEditor({
  fieldName: name,
  specsMapField
}: AlertmanagerHealthFormEditorProps) {
  const { values, setFieldValue } = useFormikContext();

  const fieldName = `${name}.${specsMapField}`;

  const nameValue = getIn(values, `${fieldName}.name`);

  // when name changes, we want to update the name of the top level field
  useEffect(() => {
    setFieldValue("name", nameValue);
  }, [nameValue, setFieldValue]);

  return (
    <>
      <div className="flex flex-row md:space-x-2">
        <FormikTextInput
          className="flex flex-col w-1/2"
          name={`${fieldName}.name`}
          label="Name"
          required
        />
        <FormikIconPicker
          className="flex flex-col w-1/2"
          name={`${fieldName}.icon`}
          label="Icon"
        />
      </div>
      <FormikScheduleField name={`${name}.schedule`} />
      <FormikTextInput name={`${fieldName}.description`} label="Description" />
      <FormikTextInput name={`${fieldName}.host`} label="URL" required />
      <FormikAuthFields
        label="Authentication"
        types={[
          {
            value: { basic: true },
            label: "Basic"
          }
        ]}
        name={`${fieldName}`}
      />
      {/* TODO: These must array of text */}
      <FormikTextInput name={`${fieldName}.alerts`} label="Alerts" />
      {/* TODO: These must key/val pairs */}
      <FormikTextInput name={`${fieldName}.filters`} label="Filters" />
      {/* TODO: These must array of text */}
      <FormikTextInput name={`${fieldName}.ignore`} label="Ignore" />
      <FormikCheckboxFieldsGroup
        name={`${fieldName}.advanced`}
        label="Advanced"
        labelClassName="font-bold"
      >
        <FormikTemplateFields
          name={`${fieldName}.display`}
          label="Customize Response"
        />

        <FormikTemplateFields
          name={`${fieldName}.transform`}
          label="Transform Response"
        />
      </FormikCheckboxFieldsGroup>
    </>
  );
}
