import FormikTextInput from "../Formik/FormikTextInput";
import FormikTemplateFields from "../Formik/FormikTemplateFields";
import HTTPMethodFieldsGroup from "./HTTPMethodFieldsGroup";
import FormikAuthFieldsGroup from "../Formik/FormikAuthFieldsGroup";
import FormikMultiSelectListField from "../Formik/FormikMultiSelectListField";
import FormikCheckboxFieldsGroup from "../Formik/FormikCheckboxFieldsGroup";

type HTTPHealthFormEditorProps = {
  fieldName: string;
};

export function HTTPHealthFormEditor({ fieldName }: HTTPHealthFormEditorProps) {
  return (
    <>
      <div className="flex flex-row md:space-x-2">
        <FormikTextInput
          className="flex flex-col w-1/2"
          name={`${fieldName}.name`}
          label="Name"
          required
        />
        <FormikTextInput
          className="flex flex-col w-1/2"
          name={`${fieldName}.icon`}
          label="Icon"
        />
      </div>
      <FormikTextInput name={`${fieldName}.description`} label="Description" />
      <FormikTextInput name={`${fieldName}.url`} label="URL" required />
      <HTTPMethodFieldsGroup
        bodyFieldName={`${fieldName}.body`}
        methodFieldName={`${fieldName}.method`}
      />
      <FormikAuthFieldsGroup name={`${fieldName}`} />

      <h5 className="text-lg font-semibold py-2">Test</h5>
      <FormikMultiSelectListField
        options={[200, 201, 202, 204, 301, 302, 401, 404, 500, 502, 503]}
        label="Response Codes"
        name={`${fieldName}.test.responseCodes`}
      />
      <FormikTextInput
        name={`${fieldName}.maxResponseTime`}
        label="Max Response Time (in millis)"
      />
      <FormikTextInput
        name={`${fieldName}.test.responseText`}
        label="Response Text (Exact Match)"
        hint="Exact response content expected to be returned by the endpoint"
      />
      <FormikTextInput
        name={`${fieldName}.maxSSLExpiry`}
        label="Max SSL Expiry Age (days)"
        hint="Maximum number of days until the SSL Certificate expires."
      />

      <FormikTemplateFields name={`${fieldName}.test.script`} label="Script" />

      <FormikCheckboxFieldsGroup
        name={`${fieldName}.advanced`}
        label="Advanced"
        labelClassName="text-lg font-semibold py-2"
      >
        <FormikTemplateFields
          name={`${fieldName}.advanced.customizeResponse`}
          label="Customize Response"
        />

        <FormikTemplateFields
          name={`${fieldName}.advanced.transformResponse`}
          label="Transform Response"
        />
      </FormikCheckboxFieldsGroup>
    </>
  );
}
