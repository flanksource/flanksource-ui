import FormikAuthFields from "../Formik/FormikAuthFields";
import FormikCheckboxFieldsGroup from "../Formik/FormikCheckboxFieldsGroup";
import FormikConnectionField from "../Formik/FormikConnectionField";
import FormikIconPicker from "../Formik/FormikIconPicker";
import FormikScheduleField from "../Formik/FormikScheduleField";
import FormikTemplateFields from "../Formik/FormikTemplateFields";
import FormikTextInput from "../Formik/FormikTextInput";
import { useUpdateCanaryNameToFirstCheckName } from "./HTTPHealthFormEditor";

type MongoHealthFormEditorProps = {
  fieldName: string;
  specsMapField: string;
};

export function MongoHealthFormEditor({
  fieldName: name,
  specsMapField
}: MongoHealthFormEditorProps) {
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

      <FormikConnectionField
        name={`${fieldName}.connection`}
        label="Connection"
      />

      <FormikTextInput name={`${fieldName}.url`} label="URL" />

      <FormikTemplateFields name={`${fieldName}.test`} label="Test" />

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
