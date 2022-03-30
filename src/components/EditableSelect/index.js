import React, { useState } from "react";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { Controller } from "react-hook-form";
import { Select } from "../Select";

export const EditableSelect = ({ control, name, options, ...props }) => {
  const [editMode, setEditMode] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value, ref, name } }) => {
        if (!editMode) {
          return (
            <button
              type="button"
              className="flex items-center"
              onClick={() => setEditMode(true)}
            >
              <p>{options.find((o) => o.value === value).label}</p>
              <HiOutlinePencilAlt className="ml-1" />
            </button>
          );
        }
        return (
          <Select
            autoFocus
            defaultMenuIsOpen
            name={name}
            options={options}
            isSearchable={false}
            inputRef={ref}
            onBlur={() => setEditMode(false)}
            value={options.find((o) => o.value === value)}
            onChange={(value) => onChange(value?.value)}
            {...props}
          />
        );
      }}
    />
  );
};
