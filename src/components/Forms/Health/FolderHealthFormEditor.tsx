import FormikTextInput from "../Formik/FormikTextInput";
import FormikTemplateFields from "../Formik/FormikTemplateFields";
import FormikCheckboxFieldsGroup from "../Formik/FormikCheckboxFieldsGroup";
import FormikIconPicker from "../Formik/FormikIconPicker";
import { getIn, useFormikContext } from "formik";
import { useEffect } from "react";
import FormikScheduleField from "../Formik/FormikScheduleField";
import { FolderHealthFilter } from "./FolderHealthFilterGroup";
import ConnectionFormEdit from "../Connection";

type FolderHealthFormEditorProps = {
  fieldName: string;
  specsMapField: string;
};

export function FolderHealthFormEditor({
  fieldName: name,
  specsMapField
}: FolderHealthFormEditorProps) {
  const { values, setFieldValue } = useFormikContext();

  const fieldName = `${name}.${specsMapField}`;

  const nameValue = getIn(values, `${fieldName}.name`);

  // when name changes, we want to update the name of the top level field
  useEffect(() => {
    setFieldValue("name", nameValue);
  }, [nameValue, setFieldValue]);

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
      <FormikTextInput
        name={`${fieldName}.path`}
        label="Folder Path"
        required
      />

      {/* this a top level schema field, not nested under http */}
      <FormikScheduleField name={`${name}.schedule`} />

      <FormikTextInput name={`${fieldName}.description`} label="Description" />
      <div className="flex flex-row md:space-x-2">
        <FormikTextInput
          className="flex flex-col w-1/2"
          name={`${fieldName}.minAge`}
          label="Min Age"
        />
        <FormikTextInput
          className="flex flex-col w-1/2"
          name={`${fieldName}.maxAge`}
          label="Max Age"
        />
      </div>
      <div className="flex flex-row md:space-x-2">
        <FormikTextInput
          className="flex flex-col w-1/2"
          name={`${fieldName}.minCount`}
          type="number"
          label="Min Count"
        />
        <FormikTextInput
          className="flex flex-col w-1/2"
          name={`${fieldName}.maxCount`}
          type="number"
          label="Max Count"
        />
      </div>
      <div className="flex flex-row md:space-x-2">
        <FormikTextInput
          className="flex flex-col w-1/2"
          name={`${fieldName}.minSize`}
          label="Min Size"
        />
        <FormikTextInput
          className="flex flex-col w-1/2"
          name={`${fieldName}.maxSize`}
          label="Max Size"
        />
      </div>
      <FormikTextInput
        name={`${fieldName}.availableSize`}
        label="Available Size"
      />
      <FormikTextInput name={`${fieldName}.totalSize`} label="Total Size" />

      <FormikCheckboxFieldsGroup
        name={`${fieldName}.filter`}
        label="Set Filter Criteria"
        labelClassName="font-semibold text-sm"
      >
        <FolderHealthFilter name={`${fieldName}.filter`} />
      </FormikCheckboxFieldsGroup>

      <ConnectionFormEdit
        name={fieldName}
        connections={["AWS", "GCP", "SFTP", "SMB"]}
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
