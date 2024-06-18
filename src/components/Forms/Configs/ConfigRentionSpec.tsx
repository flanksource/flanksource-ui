import { FieldArray, useFormikContext } from "formik";
import { get } from "lodash";
import { useMemo } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Button } from "../../../ui/Buttons/Button";
import FormikCheckboxFieldsGroup from "../Formik/FormikCheckboxFieldsGroup";
import FormikTextInput from "../Formik/FormikTextInput";

type ConfigRetentionSpecProps = {
  /**
   * @example
   *
   * fieldName="spec.retention"
   **/
  fieldName?: string;
};

export default function ConfigRetentionSpec({
  fieldName = "spec.retention"
}: ConfigRetentionSpecProps) {
  const { values } = useFormikContext<Record<string, any>>();

  const changes = useMemo(
    () => get(values, `${fieldName}.changes`),
    [fieldName, values]
  );

  const type = useMemo(
    () => get(values, `${fieldName}.type`),
    [fieldName, values]
  );

  return (
    <FormikCheckboxFieldsGroup
      name={fieldName}
      label="Retention"
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-2">
        <FieldArray
          name={`${fieldName}.changes`}
          render={({ push, remove }) => (
            <div className="flex flex-col gap-2">
              <div className="flex flex-row items-center">
                <label className="text-sm font-semibold">Changes</label>
              </div>
              {changes?.length > 0 && (
                <div className="flex flex-col gap-2">
                  {changes.map((_: any, index: number) => (
                    <div className="flex flex-row gap-2" key={index}>
                      <FormikTextInput
                        required
                        label="Name"
                        name={`${fieldName}.changes.${index}.name`}
                        type="text"
                        className="flex flex-col flex-1"
                      />
                      <FormikTextInput
                        label="Age"
                        name={`${fieldName}.changes.${index}.age`}
                        type="text"
                      />
                      <FormikTextInput
                        label="Count"
                        name={`${fieldName}.changes.${index}.count`}
                        type="number"
                      />
                      <div className="flex flex-col justify-start py-7">
                        <Button
                          onClick={() => {
                            remove(index);
                          }}
                          icon={<FaTrash />}
                          text="Delete"
                          className="btn-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex flex-row ">
                <Button
                  onClick={() => push({})}
                  text={`Add`}
                  icon={<FaPlus />}
                  className="btn-white float-right"
                  data-testid="add-retention-change"
                />
              </div>
            </div>
          )}
        />
      </div>
      <div className="flex flex-col gap-2">
        <FieldArray
          name={`${fieldName}.type`}
          render={({ push, remove }) => (
            <div className="flex flex-col gap-2">
              <div className="flex flex-row items-center">
                <label className="text-sm font-semibold">Type</label>
              </div>

              {type?.length > 0 && (
                <div className="flex flex-col gap-2">
                  {type.map((_: any, index: number) => (
                    <div className="flex flex-row gap-2" key={index}>
                      <FormikTextInput
                        required
                        label="Name"
                        name={`${fieldName}.type.${index}.name`}
                        type="text"
                        className="flex flex-col flex-1"
                      />
                      <FormikTextInput
                        label="Created Age"
                        name={`${fieldName}.type.${index}.createdAge`}
                        type="text"
                      />
                      <FormikTextInput
                        label="Updated Age"
                        name={`${fieldName}.type.${index}.updatedAge`}
                        type="text"
                      />
                      <FormikTextInput
                        label="Deleted Age"
                        name={`${fieldName}.type.${index}.deletedAge`}
                        type="text"
                      />
                      <div className="flex flex-col justify-start py-7">
                        <Button
                          onClick={() => {
                            remove(index);
                          }}
                          icon={<FaTrash />}
                          text="Delete"
                          className="btn-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex flex-row">
                <Button
                  onClick={() => push({})}
                  text={`Add`}
                  icon={<FaPlus />}
                  className="btn-white float-right"
                  data-testid="add-retention-type"
                />
              </div>
            </div>
          )}
        />
      </div>
    </FormikCheckboxFieldsGroup>
  );
}
