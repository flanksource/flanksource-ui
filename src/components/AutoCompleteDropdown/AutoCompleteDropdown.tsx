import { TextInput } from "../TextInput";
import AutoSuggest from "react-autosuggest";
import { useState } from "react";

type Props = {
  onChange: (value?: string) => void;
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
  isDisabled = false
}: Props) {
  const [filteredOptions, setFilteredOptions] = useState(options);

  if (isDisabled) {
    return (
      <TextInput id="autocomplete" value={value} disabled className="w-full" />
    );
  }

  return (
    <div className="flex flex-col pb-6 relative w-full">
      <AutoSuggest
        suggestions={filteredOptions}
        getSuggestionValue={(suggestion) => suggestion.value}
        renderSuggestion={(suggestion) => (
          <div className="px-2 py-1 w-full cursor-pointer hover:bg-gray-200 hover:font-semibold">
            {suggestion.label}
          </div>
        )}
        onSuggestionsFetchRequested={({ value }) => {
          setFilteredOptions(
            options.filter((option) =>
              option.label.toLowerCase().includes(value.trim().toLowerCase())
            )
          );
        }}
        inputProps={{
          onChange: (event, { newValue }) => {
            onChange(newValue);
          },
          value: value ?? "",
          className:
            "w-full h-full shadow-sm focus:ring-blue-500 focus:border-blue-500 py-2 sm:text-sm border-gray-300 rounded-md"
        }}
        containerProps={{
          className: "w-full absolute z-50 bg-white"
        }}
      />
    </div>
  );
}
