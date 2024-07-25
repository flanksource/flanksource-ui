import { FieldArray, useFormikContext } from "formik";
import { get } from "lodash";
import { useMemo } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Button } from "../../../ui/Buttons/Button";
import FormikConfigEnvVarFields from "./FormikConfigEnvVarFields";

type ConfigFormFieldProps = {
  label: string;
  containerClassName?: string;
  className?: string;
  name: string;
};

export default function FormikConfigEnvVarFieldsArray({
  name,
  label,
  containerClassName = "flex flex-col py-2",
  className = "flex flex-col w-full space-x-2 border border-gray-200 rounded-md p-4"
}: ConfigFormFieldProps) {
  const { values } = useFormikContext<Record<string, any>>();

  const fieldValue = useMemo(() => get(values, name), [name, values]);

  return (
    <div className={containerClassName}>
      <label className="text-sm font-semibold">{label}</label>
      <FieldArray
        name={name}
        render={(arrayHelpers) => (
          <div className={`flex flex-col space-y-4 py-2`}>
            {fieldValue &&
              fieldValue.length > 0 &&
              fieldValue.map((_: any, index: number) => (
                <div className={className} key={index}>
                  <div className="flex flex-1 flex-col">
                    <FormikConfigEnvVarFields name={`${name}.${index}`} />
                  </div>
                  <div className="flex flex-1 flex-row justify-end">
                    <Button
                      onClick={() => arrayHelpers.remove(index)}
                      icon={<FaTrash />}
                      className="btn-white w-auto"
                    />
                  </div>
                </div>
              ))}
            <div className="flex flex-1 flex-row justify-end">
              <Button
                onClick={() => arrayHelpers.push({})}
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
