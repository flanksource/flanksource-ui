import { FieldArray, useFormikContext } from "formik";
import { get } from "lodash";
import React, { useMemo } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Button } from "../../../ui/Buttons/Button";

type FormikConfigFormFormsArrayProps = {
  name: string;
  label?: string;
  containerClassName?: string;
  renderForm: (index: number) => React.ReactNode;
};

export default function FormikConfigFormFormsArray({
  name,
  label,
  containerClassName = "flex flex-col space-y-2",
  renderForm
}: FormikConfigFormFormsArrayProps) {
  const { values } = useFormikContext<Record<string, any>>();
  const fieldValue = useMemo(() => get(values, name), [name, values]);

  return (
    <div className={containerClassName}>
      <FieldArray
        name={name}
        render={(arrayHelpers) => (
          <>
            <div className="flex flex-row items-center">
              <div className="flex-1">
                {label && (
                  <label className="text-sm font-semibold">{label}</label>
                )}
              </div>
              <Button
                onClick={() => arrayHelpers.push({})}
                text={`Add`}
                icon={<FaPlus />}
                className="btn-white float-right"
              />
            </div>
            {fieldValue?.length > 0 && (
              <div
                className={`flex flex-col space-y-2 rounded-md border border-gray-200 p-4`}
              >
                {fieldValue.map((_: any, index: number) => {
                  return (
                    <React.Fragment key={index}>
                      {renderForm(index)}
                      <div className="flex flex-row justify-end">
                        <Button
                          onClick={() => {
                            arrayHelpers.remove(index);
                          }}
                          icon={<FaTrash />}
                          text="Delete"
                          className="btn-white w-24"
                        />
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            )}
          </>
        )}
      />
    </div>
  );
}
