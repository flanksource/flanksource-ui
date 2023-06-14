import FormikTextInput from "../Formik/FormikTextInput";
import FormikConfigFormFieldsArray from "../Formik/FormikConfigFormFieldsArray";

type FormikAdvancedScrapperFieldsProps = {
  fieldName: string;
};

export default function FormikAdvancedScrapperFields({
  fieldName
}: FormikAdvancedScrapperFieldsProps) {
  return (
    <>
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

      <FormikTextInput
        name={`${fieldName}.timestampFormat`}
        label="Timestamp Format"
      />

      <FormikTextInput name={`${fieldName}.items`} label="Items" />
    </>
  );
}
