import { autoUpdate, useFloating } from "@floating-ui/react";
import { Popover } from "@headlessui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/solid";
import clsx from "clsx";
import { isArray } from "lodash";
import React, { ComponentProps } from "react";
import { createPortal } from "react-dom";
import Select, { components } from "react-select";

export type GroupByOptions = {
  isTag?: boolean;
  value: string;
  label: string;
  icon?: React.ReactNode;
};

type ConfigGroupByDropdownProps = Omit<
  ComponentProps<typeof Select>,
  "components"
> & {
  label?: string;
  containerClassName?: string;
  dropDownClassNames?: string;
};

export function MultiSelectDropdown({
  isMulti = true,
  isClearable = true,
  options,
  className = "w-auto max-w-[400px]",
  label,
  containerClassName = "w-full",
  dropDownClassNames = "w-auto max-w-[300px]",
  value,
  ...props
}: ConfigGroupByDropdownProps) {
  const { refs, floatingStyles } = useFloating({
    whileElementsMounted: autoUpdate,
    placement: "bottom-start"
  });

  console.log("value", value);

  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button ref={refs.setReference}>
            <div className={containerClassName}>
              <div
                className={clsx(
                  `relative cursor-pointer h-full pl-3 rounded-md shadow-sm pr-8 py-2 text-left border border-gray-300 bg-white text-sm
                ${!value ? "text-gray-500" : ""}
              `,
                  className
                )}
              >
                <div className="flex gap-2 items-center truncate w-full">
                  {label && (
                    <div className="text-xs text-gray-500 whitespace-nowrap">
                      {label}:
                    </div>
                  )}
                  <div className="flex flex-row overflow-hidden text-ellipsis text-sm space-x-1 items-center">
                    {((isArray(value) && value.length === 0) ||
                      (typeof value === "string" && !value)) && (
                      <span className="text-black">None</span>
                    )}
                    {isMulti ? (
                      (value as GroupByOptions[]).map((v) => (
                        <div
                          className="flex flex-row bg-gray-200 items-center px-1 rounded-md"
                          key={v.value}
                        >
                          {v?.icon && <div>{v.icon}</div>}

                          {v && (
                            <div className="block">{v.label.toString()}</div>
                          )}
                        </div>
                      ))
                    ) : (
                      <>
                        {(value as GroupByOptions)?.icon && (
                          <div>{(value as GroupByOptions).icon}</div>
                        )}
                        {!(value as GroupByOptions) && (
                          <span className="block">
                            {(value as GroupByOptions).label?.toString()}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  {open ? (
                    <ChevronUpIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                  )}
                </span>
              </div>
            </div>
          </Popover.Button>

          {createPortal(
            <Popover.Panel
              ref={refs.setFloating}
              className={clsx(
                "flex flex-col bg-white rounded-sm shadow-lg absolute"
              )}
              style={floatingStyles}
            >
              <div className="flex flex-col bg-white">
                <Select
                  isClearable={isClearable}
                  isMulti={isMulti}
                  options={options}
                  value={value}
                  {...props}
                  placeholder={"Search..."}
                  components={{
                    DropdownIndicator: () => null,
                    IndicatorSeparator: null,
                    Option: (props: any) => {
                      return (
                        <components.Option {...props}>
                          <div
                            className="flex items-center text-sm cursor-pointer"
                            title={props.data.description}
                          >
                            {props.data.icon && <div>{props.data.icon}</div>}
                            <span
                              className={clsx(
                                props.data.value === value
                                  ? "font-semibold"
                                  : "font-normal",
                                "ml-2 block truncate"
                              )}
                            >
                              {props.data.label}
                            </span>
                          </div>
                        </components.Option>
                      );
                    }
                  }}
                  autoFocus
                  backspaceRemovesValue={false}
                  controlShouldRenderValue={false}
                  hideSelectedOptions={false}
                  menuIsOpen
                  tabSelectsValue={false}
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      minWidth: 288,
                      margin: "0.5rem",
                      backgroundColor: "white",
                      fontSize: "0.875rem"
                    }),
                    menuList: (provided) => ({
                      ...provided,
                      padding: 0,
                      margin: 0,
                      border: 0
                    }),
                    menu: (provided) => ({
                      ...provided,
                      padding: 0,
                      margin: 0,
                      border: 0,
                      borderTop: "1px solid #e2e8f0",
                      boxShadow: "none"
                    })
                  }}
                />
              </div>
            </Popover.Panel>,
            document.body
          )}
        </>
      )}
    </Popover>
  );
}
