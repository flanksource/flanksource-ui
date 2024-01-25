import { FormikCodeEditor } from "../Formik/FormikCodeEditor";
import FormikConfigFormFieldsArray from "../Formik/FormikConfigFormFieldsArray";
import FormikConnectionField from "../Formik/FormikConnectionField";
import FormikScheduleField from "../Formik/FormikScheduleField";
import FormikTextInput from "../Formik/FormikTextInput";
import ConfigRetentionSpec from "./ConfigRentionSpec";

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
      <ConfigRetentionSpec fieldName={`${name}.retention`} />
    </>
  );
}
