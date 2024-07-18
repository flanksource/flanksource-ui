import { FieldArray, useFormikContext } from "formik";
import { get } from "lodash";
import React, { useMemo } from "react";
import { FaTrash } from "react-icons/fa";
import { Button } from "../../../ui/Buttons/Button";
import { BsPlusCircleFill } from "react-icons/bs";
import clsx from "clsx";

type ConfigFormFieldProps = {
  label: string;
  containerClassName?: string;
  className?: string;
  hint?: string;
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
    hint?: string;
    fieldComponent: React.FC<{
      name: string;
      label?: string;
      className?: string;
      hint?: string;
    }>;
  }[];
};

export default function FormikConfigFormFieldsArray({
  name,
  fields,
  label,
  containerClassName = "flex flex-col space-y-2",
  className = "flex flex-row w-full space-x-2",
  hint = ""
}: ConfigFormFieldProps) {
  const { values } = useFormikContext<Record<string, any>>();

  const fieldValue = useMemo(() => get(values, name), [name, values]);

  return (
    <div className={containerClassName}>
      <label className="text-sm font-semibold">{label} </label>
      {hint && <p className="p-1 py-1 text-sm text-gray-500">{hint}</p>}

      <FieldArray
        name={name}
        render={(arrayHelpers) => (
          <div className={`flex flex-col space-y-1`}>
            {fieldValue &&
              fieldValue.length > 0 &&
              fieldValue.map((_: any, index: number) => (
                <div className={className} key={index}>
                  {fields.length > 0 &&
                    fields.map((field) => (
                      <field.fieldComponent
                        key={field.name}
                        name={
                          fields.length > 1
                            ? `${name}.${index}.${field.name}`
                            : `${name}.${index}`
                        }
                        label={fields.length > 1 ? field.label : undefined}
                        className={clsx(
                          "text-xs",
                          "sm:text-xs",
                          field.className
                        )}
                        hint={field.hint}
                      />
                    ))}
                  <Button
                    onClick={() => arrayHelpers.remove(index)}
                    icon={<FaTrash />}
                    className="btn-icon pl-0"
                  />
                </div>
              ))}
            <div className="flex flex-1 flex-row">
              <Button
                onClick={() => arrayHelpers.push(fields.length === 1 ? "" : {})}
                text={`Add`}
                icon={<BsPlusCircleFill />}
                className="btn-icon pl-1"
              />
            </div>
          </div>
        )}
      />
    </div>
  );
}
