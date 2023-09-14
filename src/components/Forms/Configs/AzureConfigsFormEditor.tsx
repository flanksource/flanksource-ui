import FormikTextInput from "../Formik/FormikTextInput";
import FormikConfigFormFieldsArray from "../Formik/FormikConfigFormFieldsArray";
import FormikScheduleField from "../Formik/FormikScheduleField";
import { FormikCodeEditor } from "../Formik/FormikCodeEditor";
import FormikConnectionField from "../Formik/FormikConnectionField";

type AzureConfigsFormEditorProps = {
  fieldName: string;
  specsMapField: string;
};

export default function AzureConfigsFormEditor({
  fieldName: name,
  specsMapField: schemaPath
}: AzureConfigsFormEditorProps) {
  const fieldName = `${name}.${schemaPath}`;

  return (
    <>
      <FormikScheduleField name={`${name}.schedule`} />
      <div className="flex flex-col space-y-2">
        <FormikConnectionField
          name={`${fieldName}.connection`}
          label="Connection"
          required
        />
        <FormikTextInput
          name={`${fieldName}.subscriptionID`}
          label="Subscription ID"
        />
        <FormikCodeEditor
          fieldName={`${fieldName}.tags`}
          label="Tags"
          format="json"
          className="h-48 pb-8"
        />
      </div>
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
    </>
  );
}
