import FormikAuthFieldsGroup from "../Formik/FormikAuthFieldsGroup";
import FormikTextInput from "../Formik/FormikTextInput";

/**
 * SFTPConnectionFormEditor
 *
 * Renders Formik form fields needed to edit a SFTP Connection Config object. This
 * needs to be added in the context of a Formik form, otherwise it will not work.
 *
 */
export const SFTPConnectionFormEditor = ({ name }: { name: string }) => {
  return (
    <div className="flex flex-col space-y-2">
      <FormikTextInput name={`${name}.connection`} label="Connection URL" />
      <FormikTextInput name={`${name}.port`} type="number" label="Port" />
      <FormikTextInput name={`${name}.host`} label="Host" />
      <FormikAuthFieldsGroup name={name} />
    </div>
  );
};
