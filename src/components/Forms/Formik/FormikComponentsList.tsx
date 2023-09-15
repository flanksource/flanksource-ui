import { useFormikContext, FieldArray } from "formik";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Button } from "../../Button";
import { get } from "lodash";
import { useMemo } from "react";
import FormikTextInput from "./FormikTextInput";
import FormikComponentTypesDropdown from "./FormikComponentTypesDropdown";

type FormikComponentsListProps = {
  label: string;
  containerClassName?: string;
  className?: string;
  name: string;
  required?: boolean;
};

export default function FormikComponentsList({
  name,
  label,
  containerClassName = "flex flex-col px-2 gap-2",
  className = "flex flex-col w-full gap-4 rounded-md p-2 border border-gray-300"
}: FormikComponentsListProps) {
  const { values } = useFormikContext<Record<string, any>>();

  const fieldValue = useMemo(() => get(values, name), [name, values]);

  return (
    <div className={containerClassName}>
      <label className="text-sm font-semibold">{label}</label>
      <FieldArray
        name={name}
        render={({ push, remove }) => (
          <div className={`flex flex-col gap-4`}>
            {fieldValue &&
              fieldValue.length > 0 &&
              fieldValue.map((_: any, index: number) => (
                <div className={className}>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-row items-center gap-2">
                      <FormikTextInput
                        name={`${name}.${index}.name`}
                        label="Name"
                        className="flex flex-col w-1/2 p-2"
                      />

                      <FormikTextInput
                        name={`${name}.${index}.namespace`}
                        label="Namespace"
                        className="flex flex-col w-1/2 p-2"
                      />
                    </div>
                    <div className="flex flex-row items-center gap-2">
                      <FormikTextInput
                        name={`${name}.${index}.selector`}
                        label="Selector"
                        className="flex flex-col w-1/2 p-2 "
                      />
                      <FormikComponentTypesDropdown
                        label="Types"
                        className="flex flex-col w-1/2 p-2 gap-2"
                        name={`${name}.${index}.types`}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col justify-end">
                    <Button
                      disabled={fieldValue.length === 1}
                      onClick={() => remove(index)}
                      icon={<FaTrash />}
                      className="btn-white w-auto"
                      size="xl"
                    />
                  </div>
                </div>
              ))}
            <div className="flex flex-row flex-1">
              <Button
                onClick={() => push({})}
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
