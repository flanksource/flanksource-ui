import FormikTextInput from "../Formik/FormikTextInput";
import FormikConfigFormFieldsArray from "../Formik/FormikConfigFormFieldsArray";
import FormikScheduleField from "../Formik/FormikScheduleField";
import FormikAdvancedScrapperFields from "../Formik/FormkiAdvancedScrapperFields";
import FormikConnectionField from "../Formik/FormikConnectionField";

type FileConfigsFormEditorProps = {
  fieldName: string;
  specsMapField: string;
};

export default function FileConfigsFormEditor({
  fieldName: name,
  specsMapField
}: FileConfigsFormEditorProps) {
  const fieldName = `${name}.${specsMapField}`;

  return (
    <>
      <FormikScheduleField name={`${name}.schedule`} />

      <FormikTextInput name={`${fieldName}.name`} label="Name" />
      <FormikConnectionField
        name={`${fieldName}.connection`}
        label="Connection"
      />
      <FormikTextInput name={`${fieldName}.type`} label="Type" />
      <FormikTextInput name={`${fieldName}.url`} label="URL" />
      <FormikTextInput name={`${fieldName}.id`} label="ID" />
      <FormikTextInput name={`${fieldName}.format`} label="Format" required />
      <FormikTextInput name={`${fieldName}.icon`} label="Icon" required />

      <FormikTextInput name={`${fieldName}.tags`} label="Tags" />

      <FormikConfigFormFieldsArray
        name={`${fieldName}.ignore`}
        label="ignore"
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
        <label className="font-semibold text-sm">
          Advanced scrapper options
        </label>
        <div className="flex flex-col p-4 space-y-2 border border-gray-200 rounded-md">
          <FormikAdvancedScrapperFields fieldName={fieldName} />
        </div>
      </div>
    </>
  );
}
