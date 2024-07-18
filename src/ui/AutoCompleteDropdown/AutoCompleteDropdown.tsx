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
    <div className="relative flex w-full flex-col">
      {label && <label className={`form-label mb-0`}>{label}</label>}
      <CreatableSelect
        className="h-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
