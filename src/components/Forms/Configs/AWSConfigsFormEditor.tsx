import FormikCheckbox from "../Formik/FormikCheckbox";
import FormikCheckboxFieldsGroup from "../Formik/FormikCheckboxFieldsGroup";
import FormikEnvVarConfigsFields from "../Formik/FormikConfigEnvVarFields";
import FormikConfigFormFieldsArray from "../Formik/FormikConfigFormFieldsArray";
import FormikScheduleField from "../Formik/FormikScheduleField";
import FormikTextInput from "../Formik/FormikTextInput";
import ConfigRetentionSpec from "./ConfigRentionSpec";

type AWSConfigsFormEditorProps = {
  fieldName: string;
  specsMapField: string;
};

/**
 *
 * AWSConfigsFormEditor
 *
 * Renders Formik form fields needed to edit a AWS Configs object. This
 * needs to be added in the context of a Formik form, otherwise it will not work.
 *
 */
export default function AWSConfigsFormEditor({
  fieldName: name,
  specsMapField: schemaPath
}: AWSConfigsFormEditorProps) {
  const fieldName = `${name}.${schemaPath}`;

  return (
    <>
      {/* this a top level schema field, not nested under http */}
      <FormikScheduleField name={`${name}.schedule`} />
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-semibold">AWS Connection</label>
        <FormikCheckboxFieldsGroup
          label="Access Key"
          name={`${fieldName}.awsConnection.accessKey`}
        >
          <FormikEnvVarConfigsFields
            name={`${fieldName}.awsConnection.accessKey`}
          />
        </FormikCheckboxFieldsGroup>
        <FormikCheckboxFieldsGroup
          label="Secret Key"
          name={`${fieldName}.awsConnection.secretKey`}
        >
          <FormikEnvVarConfigsFields
            name={`${fieldName}.awsConnection.secretKey`}
          />
        </FormikCheckboxFieldsGroup>
        <FormikConfigFormFieldsArray
          name={`${fieldName}.awsConnection.region`}
          label="region"
          fields={[
            {
              fieldComponent: FormikTextInput,
              name: "region"
            }
          ]}
        />
        <FormikTextInput
          name={`${fieldName}.awsConnection.endpoint`}
          label="endpoint"
        />
        <FormikCheckbox
          name={`${fieldName}.awsConnection.skipTLSVerify`}
          label="Skip TLS Verify"
        />
        <FormikTextInput
          name={`${fieldName}.awsConnection.assumeRole`}
          label="Assume Role"
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label className="text-sm font-semibold">Cloudtrail</label>
        <div className="flex flex-col space-y-2 rounded-md border border-gray-200 p-4">
          <FormikConfigFormFieldsArray
            name={`${fieldName}.cloudtrail.exclude`}
            label="Exclude"
            fields={[
              {
                fieldComponent: FormikTextInput,
                name: "cloudtrail.exclude"
              }
            ]}
          />
          <FormikTextInput
            name={`${fieldName}.cloudtrail.max_age`}
            label="Max Age"
          />
        </div>
      </div>

      <FormikCheckbox
        name={`${fieldName}.trusted_advisor_check`}
        label="Trusted Advisor Check"
      />

      <FormikConfigFormFieldsArray
        name={`${fieldName}.include`}
        label="Include"
        fields={[
          {
            fieldComponent: FormikTextInput,
            name: "include"
          }
        ]}
      />
      <FormikConfigFormFieldsArray
        name={`${fieldName}.exclude`}
        label="Exclude"
        fields={[
          {
            fieldComponent: FormikTextInput,
            name: "exclude"
          }
        ]}
      />

      <FormikCheckboxFieldsGroup name="costReporting" label="Cost Report">
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-semibold">Cost Reporting</label>
          <div className="flex flex-col space-y-2 rounded-md border border-gray-200 p-4">
            <FormikTextInput
              name={`${fieldName}.cost_reporting.s3_bucket_path`}
              label="S3 Bucket Path"
            />
            <FormikTextInput
              name={`${fieldName}.cost_reporting.table`}
              label="Table"
            />
            <FormikTextInput
              name={`${fieldName}.cost_reporting.database`}
              label="Database"
            />
            <FormikTextInput
              name={`${fieldName}.cost_reporting.region`}
              label="Region"
            />
          </div>
        </div>
      </FormikCheckboxFieldsGroup>

      <ConfigRetentionSpec fieldName={`${name}.retention`} />
    </>
  );
}
