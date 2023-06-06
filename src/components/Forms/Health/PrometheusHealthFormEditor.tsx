import FormikTextInput from "../Formik/FormikTextInput";
import FormikTemplateFields from "../Formik/FormikTemplateFields";
import FormikCheckboxFieldsGroup from "../Formik/FormikCheckboxFieldsGroup";
import FormikScheduleField from "../Formik/FormikScheduleField";

type PrometheusHealthFormEditorProps = {
  fieldName: string;
  specsMapField: string;
};

/**
 *
 * PrometheusHealthFormEditor
 *
 * Renders Formik form fields needed to edit a PrometheusHealth object. This
 * needs to be added in the context of a Formik form, otherwise it will not work.
 *
 */
export default function PrometheusHealthFormEditor({
  fieldName: name,
  specsMapField
}: PrometheusHealthFormEditorProps) {
  const fieldName = `${name}.${specsMapField}`;

  return (
    <>
      <FormikTextInput name={`${fieldName}.description`} label="Description" />
      <FormikTextInput name={`${fieldName}.name`} label="Name" />

      {/* this a top level schema field, not nested under prometheus */}
      <FormikScheduleField name={`${name}.schedule`} />

      <FormikTemplateFields name={`${fieldName}.test`} label="Script" />

      <FormikCheckboxFieldsGroup
        name={`${fieldName}.advanced`}
        label="Advanced"
        labelClassName="font-bold"
      >
        <FormikTemplateFields
          name={`${fieldName}.display`}
          label="Customize Response"
        />

        <FormikTemplateFields
          name={`${fieldName}.transform`}
          label="Transform Response"
        />
      </FormikCheckboxFieldsGroup>

      <FormikTextInput name={`${fieldName}.connection`} label="Connection" />
      <FormikTextInput name={`${fieldName}.host`} label="Host" />
    </>
  );
}
