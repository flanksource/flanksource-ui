import FormikTextInput from "../Formik/FormikTextInput";
import FormikTemplateFields from "../Formik/FormikTemplateFields";
import FormikCheckboxFieldsGroup from "../Formik/FormikCheckboxFieldsGroup";
import FormikIconPicker from "../Formik/FormikIconPicker";
import { getIn, useFormikContext } from "formik";
import { useEffect } from "react";
import FormikScheduleField from "../Formik/FormikScheduleField";
import { FormikCodeEditor } from "../Formik/FormikCodeEditor";

type ExecHealthFormEditorProps = {
  fieldName: string;
  specsMapField: string;
};

export function ExecHealthFormEditor({
  fieldName: name,
  specsMapField
}: ExecHealthFormEditorProps) {
  const { values, setFieldValue } = useFormikContext();

  const fieldName = `${name}.${specsMapField}`;

  const nameValue = getIn(values, `${fieldName}.name`);

  // when name changes, we want to update the name of the top level field
  useEffect(() => {
    setFieldValue("name", nameValue);
  }, [nameValue, setFieldValue]);

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

      <FormikCodeEditor
        format="shell"
        fieldName={`${fieldName}.script`}
        label="Script"
        className="flex flex-col h-[max(300px,calc(20vh))]"
        required
      />

      <FormikTemplateFields name={`${fieldName}.test`} label="Test" />

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
    </>
  );
}
