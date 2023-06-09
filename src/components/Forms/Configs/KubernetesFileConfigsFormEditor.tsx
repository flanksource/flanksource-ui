import FormikTextInput from "../Formik/FormikTextInput";
import FormikConfigFormFieldsArray from "../Formik/FormikConfigFormFieldsArray";
import FormikScheduleField from "../Formik/FormikScheduleField";
import FormikConfigFormFormsArray from "../Formik/FormikConfigFormFormsArray";
import FormikAdvancedScrapperFields from "../Formik/FormkiAdvancedScrapperFields";

type KubernetesConfigsFileFormEditorProps = {
  fieldName: string;
  specsMapField: string;
};

export default function KubernetesFileConfigsFormEditor({
  fieldName: name,
  specsMapField
}: KubernetesConfigsFileFormEditorProps) {
  const fieldName = `${name}.${specsMapField}`;

  return (
    <>
      <FormikScheduleField name={`${name}.schedule`} />

      <FormikTextInput name={`${fieldName}.type`} label="Type" required />
      <FormikTextInput name={`${fieldName}.id`} label="ID" required />
      <div className="flex flex-col space-y-2">
        <label className="font-semibold text-sm">Selector</label>
        <div className="flex flex-col p-4 space-y-2 border border-gray-200 rounded-md">
          <FormikTextInput name={`${fieldName}.selector.kind`} label="Kind" />
          <FormikTextInput name={`${fieldName}.selector.name`} label="Name" />
          <FormikTextInput
            name={`${fieldName}.selector.namespace`}
            label="Namespace"
          />
          <FormikTextInput
            name={`${fieldName}.selector.fieldSelector`}
            label="Field Selector"
          />
          <FormikTextInput
            name={`${fieldName}.selector.labelSelector`}
            label="Label Selector"
          />
        </div>
      </div>
      <FormikTextInput name={`${fieldName}.container`} label="Container" />
      <FormikTextInput name={`${fieldName}.format`} label="Format" />

      <FormikConfigFormFormsArray
        name={`${fieldName}.files`}
        label="Files"
        renderForm={(index) => {
          return (
            <div className="flex flex-col space-y-2">
              <FormikTextInput
                name={`${fieldName}.files.[${index}].format`}
                label="Format"
              />
              <FormikConfigFormFieldsArray
                name={`${fieldName}.files.[${index}].path`}
                label="Path"
                fields={[
                  {
                    fieldComponent: FormikTextInput,
                    name: "path"
                  }
                ]}
              />
            </div>
          );
        }}
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
