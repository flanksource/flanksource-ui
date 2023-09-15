import FormikTextInput from "./Formik/FormikTextInput";
import FormikCheckboxFieldsGroup from "./Formik/FormikCheckboxFieldsGroup";
import FormikTextArea from "./Formik/FormikTextArea";
import FormikCheckbox from "./Formik/FormikCheckbox";
import FormikConfigFormFieldsArray from "./Formik/FormikConfigFormFieldsArray";
import { getIn, useFormikContext } from "formik";
import { useEffect } from "react";
import FormikComponentsList from "./Formik/FormikComponentsList";
import FormikSeverityDropdown from "./Formik/FormikSeverityDropdown";
import FormikTypeDropdown from "./Formik/FormikTypeDropdown";

type IncidentRulesFormProps = {
  fieldName: string;
  specsMapField?: string;
};

export default function IncidentRulesForm({
  fieldName,
  specsMapField
}: IncidentRulesFormProps) {
  const { values, setFieldValue } = useFormikContext();

  const nameValue = getIn(values, `${fieldName}.name`);

  // when name changes, we want to update the name of the top level field
  useEffect(() => {
    setFieldValue("name", nameValue);
  }, [nameValue, setFieldValue]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col px-2">
        <FormikTextInput name={`${specsMapField}.name`} label="Name" required />
      </div>

      <FormikComponentsList
        name={`${specsMapField}.components`}
        label="Components"
      />

      <div className="flex flex-col gap-2 px-2">
        <label className="text-sm font-semibold">Template</label>
        <div className="flex flex-col w-full space-x-2 rounded-md p-2 border border-gray-300">
          <div className="flex flex-wrap">
            <FormikTextInput
              className="flex flex-col flex-1 p-2"
              name={`${specsMapField}.template.title`}
              label="Title"
            />

            <FormikTextArea
              className="flex flex-col w-full p-2"
              name={`${specsMapField}.template.description`}
              label="Description"
            />

            <FormikTypeDropdown
              className="flex flex-col w-1/2 p-2 gap-2"
              name={`${specsMapField}.template.type`}
              label="Type"
            />

            <FormikSeverityDropdown
              className="flex flex-col w-1/2 p-2 gap-2"
              name={`${specsMapField}.template.severity`}
              label="Severity"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col px-2 gap-4">
        <FormikTextInput name={`filter.status`} label="Status" required />
        <FormikCheckbox
          name={`${specsMapField}.breakOnMatch`}
          label="Break On Match"
          hint="Stop processing other incident rules, when matched	"
        />
      </div>

      <FormikCheckboxFieldsGroup
        name={`${specsMapField}.hoursOfOperation`}
        label="Hours of Operation"
        labelClassName="font-bold"
      >
        <FormikConfigFormFieldsArray
          name={`${specsMapField}.hoursOfOperation`}
          className="flex flex-row flex-1 gap-2"
          label={""}
          fields={[
            {
              name: "start",
              label: "Start Time",
              fieldComponent: ({ name, label, ...props }) => (
                <FormikTextInput
                  name={name}
                  label={label}
                  type="time"
                  {...props}
                />
              )
            },
            {
              name: "end",
              label: "End Time",
              fieldComponent: ({ name, label, ...props }) => (
                <FormikTextInput
                  name={name}
                  label={label}
                  type="time"
                  {...props}
                />
              )
            }
          ]}
        />
      </FormikCheckboxFieldsGroup>
    </div>
  );
}
