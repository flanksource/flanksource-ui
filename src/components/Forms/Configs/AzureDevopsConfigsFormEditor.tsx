import FormikTextInput from "../Formik/FormikTextInput";
import FormikConfigFormFieldsArray from "../Formik/FormikConfigFormFieldsArray";
import FormikScheduleField from "../Formik/FormikScheduleField";
import FormikAdvancedScrapperFields from "../Formik/FormkiAdvancedScrapperFields";
import FormikConnectionField from "../Formik/FormikConnectionField";
import FormikEnvVarConfigsFields from "../Formik/FormikConfigEnvVarFields";
import FormikCheckboxFieldsGroup from "../Formik/FormikCheckboxFieldsGroup";

type AzureDevopsConfigsFormEditorProps = {
  fieldName: string;
  specsMapField: string;
};

export default function AzureDevopsConfigsFormEditor({
  fieldName: name,
  specsMapField
}: AzureDevopsConfigsFormEditorProps) {
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
      <FormikTextInput name={`${fieldName}.id`} label="ID" />
      <FormikTextInput name={`${fieldName}.format`} label="Format" />
      <FormikTextInput
        name={`${fieldName}.organization`}
        label="Organization"
      />

      <FormikCheckboxFieldsGroup
        label="Personal Access Token"
        name={`${fieldName}.personalAccessToken`}
      >
        <FormikEnvVarConfigsFields name={`${fieldName}.personalAccessToken`} />
      </FormikCheckboxFieldsGroup>

      <FormikConfigFormFieldsArray
        name={`${fieldName}.pipelines`}
        label="Pipelines"
        fields={[
          {
            fieldComponent: FormikTextInput,
            name: "pipelines"
          }
        ]}
      />

      <FormikConfigFormFieldsArray
        name={`${fieldName}.projects`}
        label="Projects"
        fields={[
          {
            fieldComponent: FormikTextInput,
            name: "projects"
          }
        ]}
      />

      <FormikTextInput name={`${fieldName}.tags`} label="Tags" />

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
