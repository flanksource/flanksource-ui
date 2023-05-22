import React, { useState, useEffect } from "react";
import { AiFillPlusCircle } from "react-icons/ai";
import ReactTooltip from "react-tooltip";
import { BsTrash } from "react-icons/bs";

interface Props {
  label?: string;
  id: string;
  value: any;
  className?: string;
  labelClassName?: string;
  onChange: (value: any) => void;
  disabled?: boolean;
}

interface ValueProps {
  key: string;
  value: string;
}

export function CustomCodeEditor({
  value,
  onChange,
  label,
  id,
  className,
  labelClassName,
  disabled
}: Props) {
  const [parsedValues, setParsedValues] = useState<ValueProps[]>([]);
  const [clickCount, setClickCount] = useState(0); // we use the click count to display a message, to let the user know the editor is disabled
  const [toolTipText, setToolTipText] = useState("");

  useEffect(() => {
    const values = [];
    for (const property in value) {
      values.push({ key: property, value: value[property] });
    }
    setParsedValues(values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    if (clickCount > 2 && !disabled) {
      setToolTipText(
        "Unable to add new field, add the current field's values first"
      );
    }
  }, [clickCount, disabled]);

  const addNewField = () => {
    const lastElementValues = parsedValues[parsedValues.length - 1];
    if (lastElementValues.key === "") {
      return setClickCount(clickCount + 1);
    }
    setParsedValues([...parsedValues, { key: "", value: "" }]);
  };

  const onValueChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    type: string
  ) => {
    e.preventDefault();

    const values: any = [...parsedValues];
    values[index][type] = e.target.value;
    setParsedValues(values);
    parseValueToObject(values);

    if (clickCount > 0 && type === "key") {
      setClickCount(0);
      setToolTipText("");
    }
  };

  const parseValueToObject = (values: ValueProps[]) => {
    const parseValues: any = {};
    values.forEach((item) => {
      parseValues[item.key] = item.value;
    });
    return onChange(parseValues);
  };

  const deleteField = (index: number) => {
    const values = [...parsedValues];
    values.splice(index, 1);
    setParsedValues(values);
    parseValueToObject(values);
  };

  useEffect(() => {
    ReactTooltip.rebuild();
  });

  return (
    <>
      <div className="flex items-center justify-between mb-2">
        {label && (
          <label
            htmlFor={id}
            className={`block text-sm font-semibold text-gray-700 ${labelClassName}`}
          >
            {label}
          </label>
        )}
        <button
          type="button"
          className="disabled:opacity-50"
          onClick={addNewField}
          disabled={disabled}
          data-tip={toolTipText}
        >
          <AiFillPlusCircle size={32} className="text-blue-600" />
        </button>
      </div>
      {parsedValues.map((item, index) => (
        <div className="pb-2 flex ">
          <div
            className="border shadow-sm border-gray-300 rounded-md h-10 w-full"
            data-tip={disabled ? `Cannot edit in read-only mode` : ""}
          >
            {[
              {
                value: item.key,
                fieldKey: "key",
                extraCSS: "rounded-l-md bg-gray-100 text-[#a31515]"
              },
              {
                value: item.value,
                fieldKey: "value",
                extraCSS: "rounded-r-md text-[#0451a5]"
              }
            ].map(({ value, fieldKey, extraCSS }) => (
              <input
                defaultValue={value}
                type="text"
                value={value}
                name={`${value}-${index}`}
                id={`${value}-${index}`}
                disabled={disabled}
                onChange={(e) => onValueChange(e, index, fieldKey)}
                className={`h-full w-2/4 border-transparent focus:ring-blue-500 focus:border-blue-500 p-2 sm:text-sm view-lines monaco-mouse-cursor-text tracking-wider ${extraCSS} ${className}`}
              />
            ))}
          </div>
          <button
            type="button"
            className="ml-2 w-[35px] flex items-center justify-center disabled:opacity-50"
            onClick={() => deleteField(index)}
            disabled={disabled}
            data-tip={toolTipText}
          >
            <BsTrash
              size={18}
              className="text-red-600 hover:text-red-700 border-0 border-l-1 border-red-200"
            />
          </button>
        </div>
      ))}
    </>
  );
}
