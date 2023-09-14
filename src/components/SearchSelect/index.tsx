import clsx from "clsx";
import React from "react";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { HiOutlineSelector, HiSearch } from "react-icons/hi";
import Select, { SingleValue } from "react-select";

export interface OptionItem {
  readonly label: ReactNode;
  readonly value: string;
}

export interface GroupedOptionItem {
  label: string;
  options: OptionItem[];
}

export interface SearchSelectProps {
  options: OptionItem[] | GroupedOptionItem[];
  name?: string;
  components?: { [index: string]: ReactNode };
  onChange: (val: SingleValue<OptionItem>) => void;
  selected: OptionItem;
  className?: string;
  selectContainerClassName?: string;
  toggleBtn?: React.ReactNode;
  menuPlacement?: "auto" | "bottom" | "top";
}

function RenderLabel(option: OptionItem) {
  return option?.label || "";
}

const Blanket = (props: JSX.IntrinsicElements["div"]) => (
  <div className="fixed bottom-0 left-0 top-0 right-0 z-10" {...props} />
);

export const DropdownIndicator = () => (
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
  selected,
  className,
  selectContainerClassName = "bg-white shadow-card rounded-md mt-2 absolute z-20",
  toggleBtn,
  menuPlacement
}: SearchSelectProps) {
  const [isOpen, setOpen] = useState(false);
  const [value, setValue] = useState<SingleValue<OptionItem>>(selected);
  const changeCb = useCallback(
    (value: SingleValue<OptionItem>) => {
      setValue(value);
      setOpen(!isOpen);
      if (onChange) {
        onChange(value);
      }
    },
    [onChange, setValue, isOpen]
  );

  useEffect(() => {
    setValue(selected);
  }, [selected]);

  const { RenderSelection, ...remainingComponents } = useMemo(
    () => ({ ...defaultComponents, ...components }),
    [components]
  );

  return (
    <div className={clsx("relative h-full", className)}>
      {!toggleBtn && (
        <button
          className="relative cursor-pointer w-full h-full items-center bg-white border border-gray-300 rounded-md shadow-sm px-2 py-1 text-left focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm flex"
          onClick={() => setOpen(!isOpen)}
        >
          {name && (
            <span className="text-gray-500 mr-1 whitespace-nowrap">{name}</span>
          )}
          {/* @ts-expect-error */}
          <RenderSelection label={value?.label!} value={value?.value!} />
          <span className="absolute inset-y-0 right-0 flex items-center text-gray-400 pointer-events-none">
            <HiOutlineSelector size={24} />
          </span>
        </button>
      )}

      {toggleBtn && <div onClick={() => setOpen(!isOpen)}>{toggleBtn}</div>}

      {isOpen ? (
        <>
          <div className={selectContainerClassName}>
            <Select
              autoFocus
              backspaceRemovesValue={false}
              components={{
                ...remainingComponents,
                DropdownIndicator,
                IndicatorSeparator: null
              }}
              controlShouldRenderValue={false}
              hideSelectedOptions={false}
              isClearable={false}
              menuIsOpen
              onChange={(val) => {
                changeCb(val);
              }}
              options={options}
              placeholder="Search..."
              tabSelectsValue={false}
              value={value}
              menuPlacement={menuPlacement}
            />
          </div>
          <Blanket onClick={() => setOpen(!isOpen)} />
        </>
      ) : null}
    </div>
  );
}
