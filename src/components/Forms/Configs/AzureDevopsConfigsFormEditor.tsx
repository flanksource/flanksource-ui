import FormikCheckboxFieldsGroup from "../Formik/FormikCheckboxFieldsGroup";
import FormikEnvVarConfigsFields from "../Formik/FormikConfigEnvVarFields";
import FormikConfigFormFieldsArray from "../Formik/FormikConfigFormFieldsArray";
import FormikConnectionField from "../Formik/FormikConnectionField";
import FormikScheduleField from "../Formik/FormikScheduleField";
import FormikTextInput from "../Formik/FormikTextInput";
import ConfigRetentionSpec from "./ConfigRentionSpec";

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

      <ConfigRetentionSpec fieldName={`${name}.retention`} />
    </>
  );
}
