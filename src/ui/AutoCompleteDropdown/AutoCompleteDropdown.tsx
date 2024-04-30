import CreatableSelect from "react-select/creatable";

type Props = {
  onChange: (value?: string) => void;
  label?: string;
  value?: string;
  options: {
    value: string;
    label: string;
  }[];
  isDisabled?: boolean;
};

export default function AutoCompleteDropdown({
  onChange,
  value,
  options,
  label,
  isDisabled = false
}: Props) {
  return (
    <div className="flex flex-col relative w-full">
      {label && <label className={`form-label mb-0`}>{label}</label>}
      <CreatableSelect
        className="h-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
        onChange={(value) => {
          onChange(value?.value);
        }}
        value={{
          label: value,
          value: value
        }}
        options={options}
        isDisabled={isDisabled}
      />
    </div>
  );
}
