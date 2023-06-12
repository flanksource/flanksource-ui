import FormikTextInput from "../Formik/FormikTextInput";
import FormikEnvVarConfigsFields from "../Formik/FormikConfigEnvVarFields";
import FormikConfigFormFieldsArray from "../Formik/FormikConfigFormFieldsArray";
import FormikCheckboxFieldsGroup from "../Formik/FormikCheckboxFieldsGroup";
import FormikScheduleField from "../Formik/FormikScheduleField";
import FormikTextArea from "../Formik/FormikTextArea";
import FormikConnectionField from "../Formik/FormikConnectionField";

type SQLConfigsFormEditorProps = {
  fieldName: string;
  specsMapField: string;
};

export default function SQLConfigsFormEditor({
  fieldName: name,
  specsMapField: schemaPath
}: SQLConfigsFormEditorProps) {
  const fieldName = `${name}.${schemaPath}`;

  return (
    <>
      <FormikScheduleField name={`${name}.schedule`} />
      <div className="flex flex-col space-y-2">
        <FormikTextInput name={`${fieldName}.type`} label="Type" required />
        <FormikTextInput name={`${fieldName}.id`} label="ID" required />
        <FormikCheckboxFieldsGroup
          label="Username"
          name={`${fieldName}.auth.username`}
        >
          <FormikEnvVarConfigsFields name={`${fieldName}.auth.username`} />
        </FormikCheckboxFieldsGroup>
        <FormikCheckboxFieldsGroup
          label="Password"
          name={`${fieldName}.auth.password`}
        >
          <FormikEnvVarConfigsFields name={`${fieldName}.auth.password`} />
        </FormikCheckboxFieldsGroup>
        <FormikConnectionField
          name={`${fieldName}.connection`}
          label="Connection"
          required
        />
        <FormikTextInput name={`${fieldName}.driver`} label="Driver" />
        <FormikTextInput name={`${fieldName}.format`} label="Format" />
        <FormikTextArea
          className="h-48 w-full flex flex-col"
          name={`${fieldName}.query`}
          label="Query"
          required
        />
        <FormikTextInput name={`${fieldName}.items`} label="Items" />
        <FormikTextInput
          name={`${fieldName}.timestampFormat`}
          label="Timestamp Format"
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
      </div>
    </>
  );
}
