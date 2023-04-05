import FormikTextInput from "../Formik/FormikTextInput";
import FormikCheckbox from "../Formik/FormikiCheckbox";
import FormikEnvVarConfigsFields from "../Formik/FormikConfigEnvVarFields";
import FormikConfigFormFieldsArray from "../Formik/FormikConfigFormFieldsArray";

type KubernetesConfigsFormEditorProps = {
  fieldName: string;
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
  fieldName
}: KubernetesConfigsFormEditorProps) {
  return (
    <>
      <FormikTextInput name={`${fieldName}.clusterName`} label="Cluster Name" />
      <FormikTextInput name={`${fieldName}.namespace`} label="Namespace" />
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
      <FormikEnvVarConfigsFields
        name={`${fieldName}.kubeconfig`}
        label="Allow Kubeconfig"
      />
    </>
  );
}
