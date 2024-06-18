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
      <FormikTextInput
        name={`${fieldName}.clusterName`}
        label="Cluster Name"
        required
      />

      <FormikScheduleField
        type="medium"
        value="@every 30m"
        name={`${name}.schedule`}
        hint="Schedule at which to perform a full import, if Watch is enabled can be set to a longer window"
      />

      <FormikEnvVarConfigsFields
        name={`${fieldName}.kubeconfig`}
        type="textarea"
        label="Kubeconfig"
        hint="A kubeconfig file to use to connect to the cluster, if unset scrapes using config-db's service account"
      />

      <FormikCheckbox
        name={`${name}.watch`}
        label="Watch"
        hint="Watch for new events and changes"
      />

      <FormikConfigFormFieldsArray
        hint="A list of resource names to exclude from import"
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
        name={`${fieldName}.advanced`}
        label="Advanced"
      >
        <FormikTextInput
          name={`${fieldName}.namespace`}
          label="Namespace"
          hint="Only scrape resources from this namespace"
        />
        <FormikTextInput
          name={`${fieldName}.scope`}
          label="Scope"
          hint="Options are namespace,cluster or blank for both"
        />
        <FormikTextInput
          name={`${fieldName}.since`}
          label="Since"
          hint="A duration of how far back to look for events"
        />
        <FormikTextInput
          name={`${fieldName}.selector`}
          label="Selector"
          hint="Kubernetes Label selector for resources to include"
        />
        <FormikTextInput
          name={`${fieldName}.fieldSelector`}
          label="Field Selector"
          hint="Kubernetes field selector for resources to include"
        />
        <FormikTextInput
          name={`${fieldName}.maxInFlight`}
          label="Max In Flight"
          hint="Max number of in-flight requests, defaults to 64"
        />
      </FormikCheckboxFieldsGroup>

      <ConfigRetentionSpec fieldName={`${name}.retention`} />
    </>
  );
}
