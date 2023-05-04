import { useFormikContext, FieldArray } from "formik";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Button } from "../../Button";
import { get } from "lodash";
import React, { useMemo } from "react";

type ConfigFormFieldProps = {
  label: string;
  containerClassName?: string;
  className?: string;
  name: string;
  /**
   *
   * If there is only one field, then we will treat this as a simple array and
   * we won't show the label for each field.
   *
   */
  fields: {
    name: string;
    label?: string;
    className?: string;
    fieldComponent: React.FC<{
      name: string;
      label?: string;
      className?: string;
    }>;
  }[];
};

export default function FormikConfigFormFieldsArray({
  name,
  fields,
  label,
  containerClassName = "flex flex-col space-y-2",
  className = "flex flex-row w-full space-x-2"
}: ConfigFormFieldProps) {
  const { values } = useFormikContext<Record<string, any>>();

  const fieldValue = useMemo(() => get(values, name), [name, values]);

  return (
    <div className={containerClassName}>
      <label className="text-sm font-semibold">{label}</label>
      <FieldArray
        name={name}
        render={(arrayHelpers) => (
          <div className={`flex flex-col space-y-2 p-4`}>
            {fieldValue &&
              fieldValue.length > 0 &&
              fieldValue.map((_: any, index: number) => (
                <div className={className}>
                  {fields.length > 0 &&
                    fields.map(
                      ({
                        name: fieldName,
                        label: fieldLabel,
                        fieldComponent: Field,
                        className
                      }) => (
                        <Field
                          name={
                            fields.length > 1
                              ? `${name}.${index}.${fieldName}`
                              : `${name}.${index}`
                          }
                          label={fields.length > 1 ? fieldLabel : undefined}
                          className={className}
                        />
                      )
                    )}
                  <Button
                    onClick={() => arrayHelpers.remove(index)}
                    icon={<FaTrash />}
                    className="btn-white w-auto"
                  />
                </div>
              ))}
            <div className="flex flex-row flex-1">
              <Button
                onClick={() => arrayHelpers.push(fields.length === 1 ? "" : {})}
                text={`Add`}
                icon={<FaPlus />}
                className="btn-white"
              />
            </div>
          </div>
        )}
      />
    </div>
  );
}
