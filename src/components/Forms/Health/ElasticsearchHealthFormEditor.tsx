import FormikTextInput from "../Formik/FormikTextInput";
import FormikTemplateFields from "../Formik/FormikTemplateFields";
import FormikAuthFieldsGroup from "../Formik/FormikAuthFieldsGroup";
import FormikCheckboxFieldsGroup from "../Formik/FormikCheckboxFieldsGroup";
import FormikIconPicker from "../Formik/FormikIconPicker";
import { getIn, useFormikContext } from "formik";
import { useEffect } from "react";
import FormikScheduleField from "../Formik/FormikScheduleField";

type ElasticsearchHealthFormEditorProps = {
  fieldName: string;
  specsMapField: string;
};

export function ElasticsearchHealthFormEditor({
  fieldName: name,
  specsMapField
}: ElasticsearchHealthFormEditorProps) {
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

      <FormikTextInput name={`${fieldName}.url`} label="URL" required />
      <FormikTextInput name={`${fieldName}.index`} label="Index" required />
      <FormikTextInput name={`${fieldName}.query`} label="Query" required />
      <FormikTextInput
        name={`${fieldName}.results`}
        label="Expected Results"
        hint="Expected count of results, check will fail if count is not equal"
        type="number"
        min={0}
      />

      <FormikTemplateFields name={`${fieldName}.test`} label="Test" />

      <FormikAuthFieldsGroup name={`${fieldName}`} />

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
