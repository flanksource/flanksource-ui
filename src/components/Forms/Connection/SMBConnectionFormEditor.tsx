import FormikAuthFieldsGroup from "../Formik/FormikAuthFieldsGroup";
import FormikTextInput from "../Formik/FormikTextInput";

/**
 * SMBConnectionFormEditor
 *
 * Renders Formik form fields needed to edit a SMB Connection Config object. This
 * needs to be added in the context of a Formik form, otherwise it will not work.
 *
 */
export const SMBConnectionFormEditor = ({ name }: { name: string }) => {
  return (
    <div className="flex flex-col space-y-2">
      <FormikTextInput name={`${name}.connection`} label="Connection URL" />
      <FormikTextInput name={`${name}.port`} type="number" label="Port" />
      <FormikTextInput name={`${name}.domain`} label="Domain" />
      <FormikTextInput name={`${name}.workstation`} label="Work Station" />
      <FormikTextInput name={`${name}.sharename`} label="Sharename" />
      <FormikTextInput name={`${name}.searchPath`} label="Search Path" />
      <FormikAuthFieldsGroup name={name} />
    </div>
  );
};
