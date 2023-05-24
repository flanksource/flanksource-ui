import FormikTextInput from "../Formik/FormikTextInput";
import FormikConfigFormFieldsArray from "../Formik/FormikConfigFormFieldsArray";
import FormikScheduleField from "../Formik/FormikScheduleField";
import FormikAdvancedScrapperFields from "../Formik/FormkiAdvancedScrapperFields";
import FormikConnectionField from "../Formik/FormikConnectionField";
import FormikEnvVarConfigsFields from "../Formik/FormikConfigEnvVarFields";
import FormikCheckboxFieldsGroup from "../Formik/FormikCheckboxFieldsGroup";

type GithubActionsConfigsFormEditorProps = {
  fieldName: string;
  specsMapField: string;
};

export default function GithubActionsConfigsFormEditor({
  fieldName: name,
  specsMapField
}: GithubActionsConfigsFormEditorProps) {
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
      <FormikTextInput name={`${fieldName}.owner`} label="Owner" required />
      <FormikTextInput
        name={`${fieldName}.repository`}
        label="Repository"
        required
      />

      <FormikCheckboxFieldsGroup
        label="Personal Access Token"
        name={`${fieldName}.personalAccessToken`}
      >
        <FormikEnvVarConfigsFields name={`${fieldName}.personalAccessToken`} />
      </FormikCheckboxFieldsGroup>

      <FormikTextInput name={`${fieldName}.tags`} label="Tags" />

      <FormikConfigFormFieldsArray
        name={`${fieldName}.workflows`}
        label="Workflows"
        fields={[
          {
            fieldComponent: FormikTextInput,
            name: "workflows"
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
