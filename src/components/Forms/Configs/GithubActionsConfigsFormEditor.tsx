import FormikCheckboxFieldsGroup from "../Formik/FormikCheckboxFieldsGroup";
import FormikEnvVarConfigsFields from "../Formik/FormikConfigEnvVarFields";
import FormikConfigFormFieldsArray from "../Formik/FormikConfigFormFieldsArray";
import FormikConnectionField from "../Formik/FormikConnectionField";
import FormikScheduleField from "../Formik/FormikScheduleField";
import FormikTextInput from "../Formik/FormikTextInput";
import ConfigRetentionSpec from "./ConfigRentionSpec";

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
      <FormikTextInput name={`${fieldName}.tags`} label="Tags" />
      <ConfigRetentionSpec fieldName={`${name}.retention`} />
    </>
  );
}
