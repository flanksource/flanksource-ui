import FormikEnvVarConfigsFields from "../Formik/FormikConfigEnvVarFields";
import FormikTextInput from "../Formik/FormikTextInput";

/**
 * GCPConnectionFormEditor
 *
 * Renders Formik form fields needed to edit a GCP Connection Config object. This
 * needs to be added in the context of a Formik form, otherwise it will not work.
 *
 */
export const GCPConnectionFormEditor = ({ name }: { name: string }) => {
  return (
    <div className="flex flex-col space-y-2">
      <FormikTextInput name={`${name}.connection`} label="Connection URL" />
      <FormikTextInput name={`${name}.endpoint`} label="Endpoint" />

      <label className="text-sm font-semibold">Credentials</label>
      <FormikEnvVarConfigsFields name={`${name}.credentials`} />
    </div>
  );
};
