import FormikCheckbox from "../Formik/FormikCheckbox";
import FormikCheckboxFieldsGroup from "../Formik/FormikCheckboxFieldsGroup";
import FormikEnvVarConfigsFields from "../Formik/FormikConfigEnvVarFields";
import FormikConfigFormFieldsArray from "../Formik/FormikConfigFormFieldsArray";
import FormikScheduleField from "../Formik/FormikScheduleField";
import FormikTextInput from "../Formik/FormikTextInput";
import ConfigRetentionSpec from "./ConfigRentionSpec";

type KubernetesConfigsFormEditorProps = {
  fieldName: string;
  specsMapField: string;
};

/**
 *
 * KubernetesConfigsFormEditor
 *
 * Renders Formik form fields needed to edit a KubernetesConfigs object. This
 * needs to be added in the context of a Formik form, otherwise it will not work.
 *
 */
export default function KubernetesConfigsFormEditor({
  fieldName: name,
  specsMapField
}: KubernetesConfigsFormEditorProps) {
  const fieldName = `${name}.${specsMapField}`;

  return (
    <>
      <FormikTextInput name={`${fieldName}.clusterName`} label="Cluster Name" />
      <FormikTextInput name={`${fieldName}.namespace`} label="Namespace" />

      {/* this a top level schema field, not nested under http */}
      <FormikScheduleField name={`${name}.schedule`} />

      <FormikCheckbox name={`${fieldName}.useCache`} label="Use Cache" />
      <FormikCheckbox
        name={`${fieldName}.allowIncomplete`}
        label="Allow Incomplete"
      />
      <FormikTextInput name={`${fieldName}.scope`} label="Scope" />
      <FormikTextInput name={`${fieldName}.since`} label="Since" />
      <FormikTextInput name={`${fieldName}.selector`} label="Selector" />
      <FormikTextInput
        name={`${fieldName}.fieldSelector`}
        label="Field Selector"
      />
      <FormikTextInput
        name={`${fieldName}.maxInFlight`}
        label="Max In Flight"
      />
      <FormikConfigFormFieldsArray
        name={`${fieldName}.exclusions`}
        label={"Exclusions"}
        fields={[
          {
            fieldComponent: FormikTextInput,
            name: `${fieldName}.exclusions`
          }
        ]}
      />
      <FormikCheckboxFieldsGroup
        name={`${fieldName}.kubeconfig`}
        label="Allow Kubeconfig"
      >
        <FormikEnvVarConfigsFields name={`${fieldName}.kubeconfig`} />
      </FormikCheckboxFieldsGroup>

      <ConfigRetentionSpec fieldName={`${name}.retention`} />
    </>
  );
}
