import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { useFormikContext } from "formik";
import { get, set } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { TextInput } from "../../../ui/FormControls/TextInput";

type LocalStateValue = {
  key: string;
  value: string;
};

type Props = {
  name: string;
  label: string;
  hint?: string;
  outputJson?: boolean;
};

export default function FormikKeyValueMapField({
  name,
  label,
  hint,
  outputJson = false
}: Props) {
  const { values, setFieldValue } =
    useFormikContext<Record<string, Record<string, string>>>();

  const [localValues, setLocalValues] = useState<LocalStateValue[]>([]);

  // on mount, set the local values to the formik values and set the formik
  // values to the local values on change
  useEffect(() => {
    if (localValues.length === 0) {
      const value = get(values, name, {});
      // we need to account for the fact that the value could be a string or an
      // object
      const input: Record<string, string> =
        typeof value === "string" ? JSON.parse(value) : value;
      const localValues = Object.entries(input ?? {}).map(([key, value]) => ({
        key,
        value
      }));
      setLocalValues(localValues);
    }
  }, [localValues.length, name, values]);

  const onValueChange = useCallback(
    (value: LocalStateValue[]) => {
      const formValue = {};
      value.forEach(({ key, value }) => {
        set(formValue, key, value);
      });
      setFieldValue(
        name,
        outputJson ? JSON.stringify(formValue ?? {}) : formValue
      );
    },
    [name, outputJson, setFieldValue]
  );

  const handleRemove = useCallback(
    (index: number) => {
      const newState = localValues.filter((_, i) => i !== index);
      setLocalValues(newState);
      onValueChange(newState);
    },
    [localValues, onValueChange]
  );

  const handleAdd = useCallback(() => {
    const newState = [...localValues, { key: "", value: "" }];
    setLocalValues(newState);
    onValueChange(newState);
  }, [localValues, onValueChange]);

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {hint && <p className="py-1 text-sm text-gray-500">{hint}</p>}
      <div className="flex flex-col gap-2">
        {localValues.map(({ value, key }, index: number) => (
          <div className="flex flex-row gap-2" key={index}>
            <TextInput
              value={key}
              onChange={(event) => {
                const newLocalValues = localValues.map((localValue, i) => {
                  if (i === index) {
                    return { ...localValue, key: event.target.value };
                  }
                  return localValue;
                });
                setLocalValues(newLocalValues);
                onValueChange(newLocalValues);
              }}
              id={""}
            />
            :
            <TextInput
              value={value}
              onChange={(event) => {
                // find the key that matches the index
                const newLocalValues = localValues.map((localValue, i) => {
                  if (i === index) {
                    return { ...localValue, value: event.target.value };
                  }
                  return localValue;
                });
                setLocalValues(newLocalValues);
                onValueChange(newLocalValues);
              }}
              id={""}
            />
            <Button
              className="btn-white border-0"
              onClick={() => handleRemove(index)}
              aria-label="Remove"
              icon={<FaTrash />}
            />
          </div>
        ))}
      </div>
      <div className="flex flex-row justify-start gap-2">
        <Button
          className="btn-white border-0"
          onClick={handleAdd}
          text="Add"
          icon={<FaPlus />}
        />
      </div>
    </div>
  );
}
