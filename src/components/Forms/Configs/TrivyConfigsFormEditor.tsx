import FormikCheckbox from "../Formik/FormikCheckbox";
import { FormikCodeEditor } from "../Formik/FormikCodeEditor";
import FormikConfigFormFieldsArray from "../Formik/FormikConfigFormFieldsArray";
import FormikScheduleField from "../Formik/FormikScheduleField";
import FormikTextInput from "../Formik/FormikTextInput";
import ConfigRetentionSpec from "./ConfigRentionSpec";

type TrivyConfigsFormEditorProps = {
  fieldName: string;
  specsMapField: string;
};

export default function TrivyConfigsFormEditor({
  fieldName: name,
  specsMapField: schemaPath
}: TrivyConfigsFormEditorProps) {
  const fieldName = `${name}.${schemaPath}`;

  return (
    <>
      <FormikScheduleField name={`${name}.schedule`} />
      <div className="flex flex-col space-y-2">
        <FormikConfigFormFieldsArray
          name={`${fieldName}.compliance`}
          label="Compliance"
          fields={[
            {
              fieldComponent: FormikTextInput,
              name: "compliance"
            }
          ]}
        />
        <FormikCheckbox
          name={`${fieldName}.ignoreUnfixed`}
          label="Ignore Unfixed"
        />
        <FormikConfigFormFieldsArray
          name={`${fieldName}.ignoredLicenses`}
          label="Ignored Licenses"
          fields={[
            {
              fieldComponent: FormikTextInput,
              name: "ignoredLicenses"
            }
          ]}
        />

        <FormikCheckbox
          name={`${fieldName}.licenseFull`}
          label="License Full"
        />
        <FormikConfigFormFieldsArray
          name={`${fieldName}.scanners`}
          label="Scanners"
          fields={[
            {
              fieldComponent: FormikTextInput,
              name: "scanners"
            }
          ]}
        />
        <FormikConfigFormFieldsArray
          name={`${fieldName}.severity`}
          label="Severity"
          fields={[
            {
              fieldComponent: FormikTextInput,
              name: "severity"
            }
          ]}
        />
        <FormikCodeEditor
          fieldName={`${fieldName}.tags`}
          label="Tags"
          format="json"
          className="h-48 pb-8"
        />
        <FormikTextInput name={`${fieldName}.timeout`} label="Timeout" />
        <FormikTextInput
          name={`${fieldName}.timestampFormat`}
          label="Timestamp Format"
        />
        <FormikTextInput name={`${fieldName}.version`} label="Version" />
        <FormikTextInput
          name={`${fieldName}.vulnType`}
          label="Vulnerability Type"
        />
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-semibold">Kubernetes</label>
          <div className="flex flex-col space-y-2 rounded-md border border-gray-200 p-4">
            <FormikConfigFormFieldsArray
              name={`${fieldName}.kubernetes`}
              label="Components"
              fields={[
                {
                  fieldComponent: FormikTextInput,
                  name: "components"
                }
              ]}
            />
            <FormikTextInput
              name={`${fieldName}.kubernetes.context`}
              label="Context"
            />
            <FormikTextInput
              name={`${fieldName}.kubernetes.kubeconfig`}
              label="Kubeconfig"
            />
            <FormikTextInput
              name={`${fieldName}.kubernetes.namespace`}
              label="Namespace"
            />
          </div>
        </div>
      </div>

      <ConfigRetentionSpec fieldName={`${name}.retention`} />
    </>
  );
}
