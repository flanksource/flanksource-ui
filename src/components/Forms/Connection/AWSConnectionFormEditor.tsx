import FormikCheckbox from "../Formik/FormikCheckbox";
import FormikEnvVarConfigsFields from "../Formik/FormikConfigEnvVarFields";
import FormikTextInput from "../Formik/FormikTextInput";

/**
 * AWSConnectionFormEditor
 *
 * Renders Formik form fields needed to edit a AWS Connection Config object. This
 * needs to be added in the context of a Formik form, otherwise it will not work.
 *
 */
export const AWSConnectionFormEditor = ({ name }: { name: string }) => {
  return (
    <div className="flex flex-col space-y-2">
      <FormikTextInput name={`${name}.connection`} label="Connection URL" />
      <FormikTextInput name={`${name}.region`} label="Region" />
      <FormikTextInput name={`${name}.endpoint`} label="Endpoint" />
      <FormikTextInput name={`${name}.objectPath`} label="Object Path" />

      <label className="text-sm font-semibold">Secret Key</label>
      <FormikEnvVarConfigsFields name={`${name}.secretKey`} />

      <label className="text-sm font-semibold">Access Key</label>
      <FormikEnvVarConfigsFields name={`${name}.accessKey`} />

      <div className="flex flex-row md:space-x-2">
        <FormikCheckbox
          className={`w-1/2`}
          name={`${name}.skipTLSVerify`}
          label="Skip TLS Verify"
        />
        <FormikCheckbox
          className={`w-1/2`}
          name={`${name}.usePathStyle`}
          label="Use Path Style"
        />
      </div>
    </div>
  );
};
