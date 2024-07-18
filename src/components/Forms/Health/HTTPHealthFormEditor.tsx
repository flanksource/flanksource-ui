import { getIn, useFormikContext } from "formik";
import { useEffect, useState } from "react";
import FormikAuthFields from "../Formik/FormikAuthFields";
import FormikCheckboxFieldsGroup from "../Formik/FormikCheckboxFieldsGroup";
import FormikConfigEnvVarFieldsArray from "../Formik/FormikConfigEnvVarFieldsArray";
import FormikIconPicker from "../Formik/FormikIconPicker";
import FormikMultiSelectListField from "../Formik/FormikMultiSelectListField";
import FormikNumberInput from "../Formik/FormikNumberInput";
import FormikScheduleField from "../Formik/FormikScheduleField";
import FormikTemplateFields from "../Formik/FormikTemplateFields";
import FormikTextInput from "../Formik/FormikTextInput";
import HTTPMethodFieldsGroup from "./HTTPMethodFieldsGroup";

/**
 *
 * A hook to update the first canary name to the top level name, as long as the name of
 * the check is the same as the canary name (i.e. the first check)
 *
 */
export function useUpdateCanaryNameToFirstCheckName(fieldName: string) {
  const [canaryName, setCanaryName] = useState<string | undefined>();
  const { values, setFieldValue } = useFormikContext<Record<string, string>>();

  useEffect(() => {
    // if the field name ends with 0, it is the first check, and we want to
    // update the name of that check only
    if (fieldName.endsWith("0")) {
      const nameValue = getIn(values, `${fieldName}.name`);
      const updatedCanaryName = getIn(values, "name");

      // if the name of the current check is not the canary name, we don't want to update it
      if (nameValue !== canaryName) {
        return;
      }
      setCanaryName(updatedCanaryName);
      setFieldValue(`${fieldName}.name`, updatedCanaryName);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldName, setFieldValue, values]);
}

type HTTPHealthFormEditorProps = {
  fieldName: string;
  specsMapField: string;
};

export function HTTPHealthFormEditor({
  fieldName: name,
  specsMapField
}: HTTPHealthFormEditorProps) {
  const fieldName = `${name}.${specsMapField}`;

  useUpdateCanaryNameToFirstCheckName(fieldName);

  return (
    <>
      <div className="flex flex-row md:space-x-2">
        <FormikTextInput
          className="flex w-1/2 flex-col"
          name={`${fieldName}.name`}
          label="Name"
          required
        />
        <FormikIconPicker
          className="flex w-1/2 flex-col"
          name={`${fieldName}.icon`}
          label="Icon"
        />
      </div>

      {/* this a top level schema field, not nested under http */}
      <FormikScheduleField name={`${name}.schedule`} />

      <FormikTextInput name={`${fieldName}.description`} label="Description" />
      <FormikTextInput name={`${fieldName}.url`} label="URL" required />
      <HTTPMethodFieldsGroup
        bodyFieldName={`${fieldName}.body`}
        methodFieldName={`${fieldName}.method`}
      />

      <FormikConfigEnvVarFieldsArray
        name={`${fieldName}.headers`}
        label="Headers"
      />

      <FormikAuthFields
        label="Authentication"
        types={[
          {
            value: { basic: true },
            label: "Basic"
          },
          {
            value: { ntlm: true },
            label: "NTLM"
          },
          {
            value: { ntlmv2: true },
            label: "NTLMv2"
          }
        ]}
        name={`${fieldName}`}
      />

      <h5 className="font-bold">Test</h5>
      <FormikMultiSelectListField
        options={[200, 201, 202, 204, 301, 302, 401, 404, 500, 502, 503]}
        label="Response Codes"
        name={`${fieldName}.responseCodes`}
      />

      <FormikNumberInput
        name={`${fieldName}.thresholdMillis`}
        label="Max Response Time (in millis)"
        min={0}
      />

      <FormikTextInput
        name={`${fieldName}.responseContent`}
        label="Response Text (Exact Match)"
        hint="Exact response content expected to be returned by the endpoint"
      />

      <FormikNumberInput
        name={`${fieldName}.maxSSLExpiry`}
        label="Max SSL Expiry Age (days)"
        hint="Maximum number of days until the SSL Certificate expires."
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
