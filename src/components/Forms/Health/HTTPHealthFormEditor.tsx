import FormikTextInput from "../Formik/FormikTextInput";
import FormikTemplateFields from "../Formik/FormikTemplateFields";
import HTTPMethodFieldsGroup from "./HTTPMethodFieldsGroup";
import FormikAuthFieldsGroup from "../Formik/FormikAuthFieldsGroup";
import FormikMultiSelectListField from "../Formik/FormikMultiSelectListField";
import FormikCheckboxFieldsGroup from "../Formik/FormikCheckboxFieldsGroup";
import FormikConfigEnvVarFieldsArray from "../Formik/FormikConfigEnvVarFieldsArray";
import FormikIconPicker from "../Formik/FormikIconPicker";
import { getIn, useFormikContext } from "formik";
import { useEffect } from "react";
import FormikSelectDropdown from "../Formik/FormikAutomcompletDropdown";

type HTTPHealthFormEditorProps = {
  fieldName: string;
};

export function HTTPHealthFormEditor({ fieldName }: HTTPHealthFormEditorProps) {
  const { values, setFieldValue } = useFormikContext();

  const name = getIn(values, `${fieldName}.name`);

  // when name changes, we want to update the name of the top level field
  useEffect(() => {
    setFieldValue("name", name);
  }, [name, setFieldValue]);

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

      <FormikSelectDropdown
        name={`${fieldName}.schedule`}
        label="Schedule"
        required
        options={[
          {
            label: "@every 30s",
            value: "@every 30s"
          },
          {
            label: "@every 1m",
            value: "@every 1m"
          },
          {
            label: "@every 5m",
            value: "@every 5m"
          },
          {
            label: "@every 30m",
            value: "@every 30m"
          },
          {
            label: "@hourly",
            value: "@hourly"
          },
          {
            label: "@every 6h",
            value: "@every 6h"
          },
          {
            label: "@daily",
            value: "@daily"
          },
          {
            label: "@weekly",
            value: "@weekly"
          }
        ]}
      />

      <FormikTextInput name={`${fieldName}.description`} label="Description" />
      <FormikTextInput name={`${fieldName}.endpoint`} label="URL" required />
      <HTTPMethodFieldsGroup
        bodyFieldName={`${fieldName}.body`}
        methodFieldName={`${fieldName}.method`}
      />

      <FormikConfigEnvVarFieldsArray
        name={`${fieldName}.headers`}
        label="Headers"
      />

      <FormikAuthFieldsGroup name={`${fieldName}`} />

      <h5 className="font-bold">Test</h5>
      <FormikMultiSelectListField
        options={[200, 201, 202, 204, 301, 302, 401, 404, 500, 502, 503]}
        label="Response Codes"
        name={`${fieldName}.responseCodes`}
      />
      <FormikTextInput
        name={`${fieldName}.thresholdMillis`}
        label="Max Response Time (in millis)"
        type="number"
        min={0}
      />
      <FormikTextInput
        name={`${fieldName}.responseContent`}
        label="Response Text (Exact Match)"
        hint="Exact response content expected to be returned by the endpoint"
      />
      <FormikTextInput
        name={`${fieldName}.maxSSLExpiry`}
        label="Max SSL Expiry Age (days)"
        hint="Maximum number of days until the SSL Certificate expires."
        type="number"
        min={0}
      />

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
    </>
  );
}
