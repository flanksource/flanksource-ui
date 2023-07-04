import FormikTextInput from "../Formik/FormikTextInput";
import FormikScheduleField from "../Formik/FormikScheduleField";
import FormikConfigFormFieldsArray from "../Formik/FormikConfigFormFieldsArray";
import FormikIconPicker from "../Formik/FormikIconPicker";

type DNSHealthFormEditorProps = {
  fieldName: string;
  specsMapField: string;
};

/**
 *
 * DNSHealthFormEditor
 *
 * Renders Formik form fields needed to edit a DNSHealth object. This
 * needs to be added in the context of a Formik form, otherwise it will not work.
 *
 */
export default function DNSHealthFormEditor({
  fieldName: name,
  specsMapField
}: DNSHealthFormEditorProps) {
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
      <FormikTextInput name={`${fieldName}.description`} label="Description" />
      <FormikTextInput name={`${fieldName}.server`} label="Server" />

      <FormikTextInput name={`${fieldName}.port`} label="Port" type="number" />

      <FormikTextInput name={`${fieldName}.query`} label="Query" />
      <FormikTextInput name={`${fieldName}.querytype`} label="Query Type" />
      <FormikTextInput
        name={`${fieldName}.minrecords`}
        label="Minimum Records"
        type="number"
        min={0}
      />

      <FormikConfigFormFieldsArray
        name={`${fieldName}.exactreply`}
        label="Exact Reply"
        fields={[
          {
            fieldComponent: FormikTextInput,
            name: "exactreply"
          }
        ]}
      />

      <FormikTextInput name={`${fieldName}.timeout`} label="Timeout" />

      <FormikTextInput
        name={`${fieldName}.thresholdMillis`}
        hint="Expected response time threshold in ms"
        label="Threshold millis"
        type="number"
        min={0}
      />
    </>
  );
}
