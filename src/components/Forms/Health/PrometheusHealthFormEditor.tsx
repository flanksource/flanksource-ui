import FormikTextInput from "../Formik/FormikTextInput";
import FormikTemplateFields from "../Formik/FormikTemplateFields";
import FormikTextArea from "../Formik/FormikTextArea";
import FormikIconPicker from "../Formik/FormikIconPicker";
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
      <div className="flex flex-row md:space-x-2">
        <FormikTextInput
          className="flex flex-col w-1/2"
          name={`${fieldName}.name`}
          label="Name"
          required
        />
        <FormikIconPicker
          className="flex flex-col w-1/2"
          name={`${fieldName}.icon`}
          label="Icon"
        />
      </div>

      <FormikScheduleField name={`${name}.schedule`} />

      <FormikTextInput name={`${fieldName}.description`} label="Description" />

      <FormikTemplateFields name={`${fieldName}.test`} label="Test" />
      <FormikTemplateFields name={`${fieldName}.display`} label="Display" />

      <FormikTextArea name={`${fieldName}.query`} label="Query" required />

      <FormikTextInput name={`${fieldName}.host`} label="Host" required />
    </>
  );
}
