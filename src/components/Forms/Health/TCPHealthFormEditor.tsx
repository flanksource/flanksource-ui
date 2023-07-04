import FormikTextInput from "../Formik/FormikTextInput";
import FormikTemplateFields from "../Formik/FormikTemplateFields";
import FormikCheckboxFieldsGroup from "../Formik/FormikCheckboxFieldsGroup";
import FormikIconPicker from "../Formik/FormikIconPicker";
import { getIn, useFormikContext } from "formik";
import { useEffect } from "react";
import FormikScheduleField from "../Formik/FormikScheduleField";

type TCPHealthFormEditorProps = {
  fieldName: string;
  specsMapField: string;
};

export function TCPHealthFormEditor({
  fieldName: name,
  specsMapField
}: TCPHealthFormEditorProps) {
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

      <FormikTextInput name={`${fieldName}.endpoint`} label="URL" required />

      <FormikTemplateFields name={`${fieldName}.test`} label="Test" />
      <FormikTextInput
        name={`${fieldName}.thresholdMillis`}
        label="Max Response Time (in millis)"
        type="number"
        min={0}
      />

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
