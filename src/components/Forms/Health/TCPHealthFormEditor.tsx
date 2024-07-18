import FormikCheckboxFieldsGroup from "../Formik/FormikCheckboxFieldsGroup";
import FormikIconPicker from "../Formik/FormikIconPicker";
import FormikScheduleField from "../Formik/FormikScheduleField";
import FormikTemplateFields from "../Formik/FormikTemplateFields";
import FormikTextInput from "../Formik/FormikTextInput";
import { useUpdateCanaryNameToFirstCheckName } from "./HTTPHealthFormEditor";

type TCPHealthFormEditorProps = {
  fieldName: string;
  specsMapField: string;
};

export function TCPHealthFormEditor({
  fieldName: name,
  specsMapField
}: TCPHealthFormEditorProps) {
  const fieldName = `${name}.${specsMapField}`;

  useUpdateCanaryNameToFirstCheckName(fieldName);

  return (
    <>
      <div className="flex flex-row md:space-x-2">
        <FormikTextInput
          className="flex w-1/2 flex-col"
          name={`${fieldName}.name`}
          label="Name"
          required
        />
        <FormikIconPicker
          className="flex w-1/2 flex-col"
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
