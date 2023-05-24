import FormikTextInput from "../Formik/FormikTextInput";
import FormikCheckbox from "../Formik/FormikCheckbox";
import FormikConfigFormFieldsArray from "../Formik/FormikConfigFormFieldsArray";
import FormikScheduleField from "../Formik/FormikScheduleField";
import { FormikCodeEditor } from "../Formik/FormikCodeEditor";

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
        <FormikTextInput name={`${fieldName}.type`} label="Type" />
        <FormikTextInput name={`${fieldName}.id`} label="ID" />
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
        <FormikTextInput name={`${fieldName}.items`} label="Items" />
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
        <FormikConfigFormFieldsArray
          name={`${fieldName}.createFields`}
          label="Create Fields"
          fields={[
            {
              fieldComponent: FormikTextInput,
              name: "createFields"
            }
          ]}
        />
        <FormikConfigFormFieldsArray
          name={`${fieldName}.deleteFields`}
          label="Delete Fields"
          fields={[
            {
              fieldComponent: FormikTextInput,
              name: "deleteFields"
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
          <label className="font-semibold text-sm">Kubernetes</label>
          <div className="flex flex-col p-4 space-y-2 border border-gray-200 rounded-md">
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
    </>
  );
}
