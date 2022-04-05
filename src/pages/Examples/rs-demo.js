import React, { useState } from "react";
import { HiCheck } from "react-icons/hi";
import { useForm } from "react-hook-form";
import { components, Select } from "../../components/Select";
import { SearchLayout } from "../../components/Layout";

const options = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" }
];

const Option = (props) => {
  const { isSelected, children } = props;

  return (
    <components.Option {...props}>
      <div className="flex justify-between">
        <span>{children}</span>
        <span className="ml-2">
          {isSelected && <HiCheck className="h-5 w-5" />}
        </span>
      </div>
    </components.Option>
  );
};

export function RsDemoPage() {
  const [selected, setSelected] = useState([]);
  const { control, handleSubmit } = useForm({
    defaultValues: {
      asd: []
    }
  });
  const onSubmit = (data) => console.log(data);

  return (
    <SearchLayout title="Topology">
      <div className="">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Select
            className="mb-4"
            name="asd"
            control={control}
            options={options}
            isMulti
            allowSelectAll
            hideSelectedOptions={false}
            components={{ Option }}
          />
          <Select
            className="mb-4"
            name="asd2"
            options={options}
            value={selected}
            isMulti
            allowSelectAll
            hideSelectedOptions={false}
            components={{ Option }}
            onChange={setSelected}
          />
        </form>
      </div>
    </SearchLayout>
  );
}
