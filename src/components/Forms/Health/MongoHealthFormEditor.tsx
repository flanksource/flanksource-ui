import FormikTextInput from "../Formik/FormikTextInput";
import FormikTemplateFields from "../Formik/FormikTemplateFields";
import FormikAuthFieldsGroup from "../Formik/FormikAuthFieldsGroup";
import FormikCheckboxFieldsGroup from "../Formik/FormikCheckboxFieldsGroup";
import FormikIconPicker from "../Formik/FormikIconPicker";
import { getIn, useFormikContext } from "formik";
import { useEffect } from "react";
import FormikScheduleField from "../Formik/FormikScheduleField";
import FormikEnvVarConfigsFields from "../Formik/FormikConfigEnvVarFields";
import FormikConnectionField from "../Formik/FormikConnectionField";

type MongoHealthFormEditorProps = {
  fieldName: string;
  specsMapField: string;
};

export function MongoHealthFormEditor({
  fieldName: name,
  specsMapField
}: MongoHealthFormEditorProps) {
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

      <FormikCheckboxFieldsGroup name={`${name}.username`} label="Username">
        <FormikEnvVarConfigsFields name={`${fieldName}.username`} />
      </FormikCheckboxFieldsGroup>

      <FormikCheckboxFieldsGroup name={`${name}.password`} label="Password">
        <FormikEnvVarConfigsFields name={`${fieldName}.password`} />
      </FormikCheckboxFieldsGroup>

      <FormikConnectionField
        name={`${fieldName}.connection`}
        label="Connection"
      />

      <FormikTextInput name={`${fieldName}.url`} label="URL" />

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
