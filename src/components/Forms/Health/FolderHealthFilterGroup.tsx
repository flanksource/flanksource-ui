import FormikTextInput from "../Formik/FormikTextInput";

export const FolderHealthFilter = ({ name }: { name: string }) => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex flex-row md:space-x-2">
        <FormikTextInput
          className="flex w-1/2 flex-col"
          name={`${name}.minAge`}
          label="Min Age"
        />
        <FormikTextInput
          className="flex w-1/2 flex-col"
          name={`${name}.maxAge`}
          label="Max Age"
        />
      </div>
      <div className="flex flex-row md:space-x-2">
        <FormikTextInput
          className="flex w-1/2 flex-col"
          name={`${name}.minSize`}
          label="Min Size"
        />
        <FormikTextInput
          className="flex w-1/2 flex-col"
          name={`${name}.maxSize`}
          label="Max Size"
        />
      </div>
      <FormikTextInput name={`${name}.regex`} label="Path Regex" />
    </div>
  );
};
