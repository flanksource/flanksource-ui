import FormikTextInput from "../Formik/FormikTextInput";
import FormikCheckbox from "../Formik/FormikCheckbox";
import FormikEnvVarConfigsFields from "../Formik/FormikConfigEnvVarFields";
import FormikConfigFormFieldsArray from "../Formik/FormikConfigFormFieldsArray";
import FormikCheckboxFieldsGroup from "../Formik/FormikCheckboxFieldsGroup";
import FormikScheduleField from "../Formik/FormikScheduleField";

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
        <label className="font-semibold text-sm">AWS Connection</label>
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

      <FormikCheckbox name={`${fieldName}.patch_states`} label="Patch States" />
      <FormikCheckbox
        name={`${fieldName}.patch_details`}
        label="Patch Details"
      />
      <FormikCheckbox name={`${fieldName}.inventory`} label="Inventory" />
      <FormikCheckbox name={`${fieldName}.compliance`} label="Compliance" />

      <div className="flex flex-col space-y-2">
        <label className="font-semibold text-sm">Cloudtrail</label>
        <div className="flex flex-col p-4 space-y-2 border border-gray-200 rounded-md">
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

      <div className="flex flex-col space-y-2">
        <label className="font-semibold text-sm">Cost Reporting</label>
        <div className="flex flex-col p-4 space-y-2 border border-gray-200 rounded-md">
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
    </>
  );
}
