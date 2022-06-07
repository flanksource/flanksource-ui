import { ReactNode, useCallback, useMemo, useState } from "react";
import { HiOutlineSelector, HiSearch } from "react-icons/hi";
import Select from "react-select";

export interface OptionItem {
  readonly label: ReactNode;
  readonly value: string;
}

export interface SearchSelectProps {
  options: OptionItem[];
  name?: string;
  components?: { [index: string]: ReactNode };
  onChange: (OptionItem) => void;
  selected: OptionItem;
}

function RenderLabel(option: SelectOption) {
  return option?.label || "";
}

const Blanket = (props: JSX.IntrinsicElements["div"]) => (
  <div className="fixed bottom-0 left-0 top-0 right-0 z-10" {...props} />
);

const DropdownIndicator = () => (
  <HiSearch className="text-gray-400" size={24} />
);

const defaultComponents = {
  RenderSelection: RenderLabel
};

export function SearchSelect({
  options,
  name,
  onChange,
  components,
  selected
}: SearchSelectProps) {
  const [isOpen, setOpen] = useState(false);
  const [value, setValue] = useState(selected);
  const changeCb = useCallback(
    (value) => {
      setValue(value);
      setOpen(!isOpen);
      if (onChange) {
        onChange(value);
      }
    },
    [onChange, setValue, isOpen]
  );

  const { RenderSelection } = useMemo(
    () => ({ ...defaultComponents, ...components }),
    [components]
  );

  return (
    <div className="relative">
      <button
        className="relative cursor-pointer w-full bg-white border border-gray-300 rounded-md shadow-sm px-2 py-2 text-left focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm flex"
        onClick={() => setOpen(!isOpen)}
      >
        {name && (
          <span className="text-gray-500 mr-1 whitespace-nowrap">{name}</span>
        )}
        {<RenderSelection label={value?.label} value={value?.value} />}
        <span className="absolute inset-y-0 right-0 flex items-center text-gray-400 pointer-events-none">
          <HiOutlineSelector size={24} />
        </span>
      </button>

      {isOpen ? (
        <>
          <div className="bg-white shadow-card w-96 rounded-md mt-2 absolute z-20">
            <Select
              autoFocus
              backspaceRemovesValue={false}
              components={{ DropdownIndicator, IndicatorSeparator: null }}
              controlShouldRenderValue={false}
              hideSelectedOptions={false}
              isClearable={false}
              menuIsOpen
              onChange={changeCb}
              options={options}
              placeholder="Search..."
              tabSelectsValue={false}
              value={value}
            />
          </div>

          <Blanket onClick={() => setOpen(!isOpen)} />
        </>
      ) : null}
    </div>
  );
}
