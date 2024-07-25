import FormikConfigFormFieldsArray from "../Formik/FormikConfigFormFieldsArray";
import FormikConnectionField from "../Formik/FormikConnectionField";
import FormikScheduleField from "../Formik/FormikScheduleField";
import FormikTextInput from "../Formik/FormikTextInput";
import FormikAdvancedScrapperFields from "../Formik/FormkiAdvancedScrapperFields";
import ConfigRetentionSpec from "./ConfigRentionSpec";

type HttpConfigsFormEditorProps = {
  fieldName: string;
  specsMapField: string;
};

export default function HttpConfigsFormEditor({
  fieldName: name,
  specsMapField
}: HttpConfigsFormEditorProps) {
  const fieldName = `${name}.${specsMapField}`;

  return (
    <>
      <FormikScheduleField name={`${name}.schedule`} />

      <FormikTextInput name={`${fieldName}.name`} label="Name" />
      <FormikConnectionField
        name={`${fieldName}.connection`}
        label="Connection"
      />
      <FormikTextInput name={`${fieldName}.url`} label="URL" required />
      <FormikTextInput name={`${fieldName}.type`} label="Type" required />
      <FormikTextInput name={`${fieldName}.id`} label="ID" required />
      <FormikTextInput name={`${fieldName}.format`} label="Format" />
      <FormikTextInput name={`${fieldName}.icon`} label="Icon" />
      <FormikTextInput name={`${fieldName}.tags`} label="Tags" />

      <FormikConfigFormFieldsArray
        name={`${fieldName}.ignore`}
        label="Ignore"
        fields={[
          {
            fieldComponent: FormikTextInput,
            name: "ignore"
          }
        ]}
      />

      <FormikConfigFormFieldsArray
        name={`${fieldName}.paths`}
        label="Paths"
        fields={[
          {
            fieldComponent: FormikTextInput,
            name: "paths"
          }
        ]}
      />

      <div className="flex flex-col space-y-2">
        <label className="text-sm font-semibold">Advanced Options</label>
        <div className="flex flex-col space-y-2 rounded-md border border-gray-200 p-4">
          <FormikAdvancedScrapperFields fieldName={fieldName} />
        </div>
      </div>

      <ConfigRetentionSpec fieldName={`${name}.retention`} />
    </>
  );
}
