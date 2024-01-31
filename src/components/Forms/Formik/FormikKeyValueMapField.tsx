import { useFormikContext } from "formik";
import { get, set } from "lodash";
import { useEffect, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Button } from "../../../ui/Button";
import { TextInput } from "../../TextInput";

type LocalStateValue = {
  key: string;
  value: string;
};

type Props = {
  name: string;
  label: string;
};

export default function FormikKeyValueMapField({ name, label }: Props) {
  const [localValues, setLocalValue] = useState<LocalStateValue[]>([
    { key: "", value: "" }
  ]);

  const { values, setFieldValue } =
    useFormikContext<Record<string, Record<string, string>>>();

  // on mount, set the local values to the formik values and set the formik
  // values to the local values on change
  useEffect(() => {
    const localValues = Object.entries(get(values, name, {})).map(
      ([key, value]) => ({ key, value })
    );
    setLocalValue(localValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const formValue = {};
    localValues.forEach(({ key, value }) => {
      set(formValue, key, value);
    });
    setFieldValue(name, formValue);
  }, [localValues, name, setFieldValue]);

  const handleRemove = (index: number) => {
    setLocalValue((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAdd = () => {
    setLocalValue((prev) => [...prev, { key: "", value: "" }]);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
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
                setLocalValue(newLocalValues);
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
                setLocalValue(newLocalValues);
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
      <div className="flex flex-row gap-2 justify-start">
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
