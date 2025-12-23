import { autoUpdate, useFloating } from "@floating-ui/react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/solid";
import clsx from "clsx";
import { isArray } from "lodash";
import React, { ComponentProps } from "react";
import { createPortal } from "react-dom";
import Select, { components } from "react-windowed-select";

export type GroupByOptions = {
  isTag?: boolean;
  value: string;
  label: string;
  icon?: React.ReactNode;
};

type ConfigGroupByDropdownProps = Omit<
  ComponentProps<typeof Select>,
  "components" | "defaultValue" | "windowThreshold"
> & {
  minMenuWidth?: string;
  label?: string;
  containerClassName?: string;
  dropDownClassNames?: string;
  defaultValue?: string;
  closeMenuOnSelect?: boolean;
};

export function MultiSelectDropdown({
  isMulti = true,
  isClearable = true,
  options,
  className = "w-auto max-w-[400px]",
  label,
  minMenuWidth = "500px",
  containerClassName = "w-full",
  dropDownClassNames = "w-auto max-w-[300px]",
  value,
  defaultValue,
  closeMenuOnSelect = false,
  onChange = () => {},
  ...props
}: ConfigGroupByDropdownProps) {
  const { refs, floatingStyles } = useFloating({
    whileElementsMounted: autoUpdate,
    placement: "bottom-start"
  });

  return (
    <Popover className="relative">
      {({ open, close }) => (
        <>
          <PopoverButton ref={refs.setReference}>
            <div className={containerClassName}>
              <div
                className={clsx(
                  `relative h-full cursor-pointer rounded-md border border-gray-300 bg-white py-2 pl-3 pr-8 text-left text-sm shadow-sm ${!value ? "text-gray-500" : ""} `,
                  className
                )}
              >
                <div className="flex w-full items-center gap-2 truncate">
                  {label && (
                    <div className="whitespace-nowrap text-xs text-gray-500">
                      {label}:
                    </div>
                  )}
                  <div className="flex flex-row items-center space-x-1 overflow-hidden text-ellipsis text-sm">
                    {((isArray(value) && value.length === 0) ||
                      (typeof value === "string" && !value)) && (
                      <span className="text-black">
                        {defaultValue ? defaultValue : <>None</>}
                      </span>
                    )}
                    {isMulti ? (
                      (value as GroupByOptions[]).map((v) => (
                        <div
                          className="flex flex-row items-center gap-1 rounded-md bg-gray-200 px-1"
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
                        {(value as GroupByOptions) && (
                          <span className="block">
                            {(value as GroupByOptions).label?.toString()}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  {open ? (
                    <ChevronUpIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                  )}
                </span>
              </div>
            </div>
          </PopoverButton>

          {createPortal(
            <PopoverPanel
              ref={refs.setFloating}
              className={clsx(
                "absolute flex flex-col rounded-sm bg-white shadow-lg",
                dropDownClassNames
              )}
              style={floatingStyles}
            >
              <div className="flex flex-col bg-white">
                <Select
                  isClearable={isClearable}
                  isMulti={isMulti}
                  options={options}
                  value={value}
                  onChange={(value, actionMeta) => {
                    onChange(value, actionMeta);
                    close();
                  }}
                  {...props}
                  placeholder={"Search..."}
                  components={{
                    DropdownIndicator: () => null,
                    IndicatorSeparator: null,
                    Option: (props: any) => {
                      return (
                        <components.Option {...props}>
                          <div
                            className="flex cursor-pointer items-center text-sm"
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
                  windowThreshold={0.5}
                  autoFocus
                  backspaceRemovesValue={false}
                  controlShouldRenderValue={false}
                  hideSelectedOptions={false}
                  menuIsOpen
                  tabSelectsValue={false}
                  closeMenuOnSelect={closeMenuOnSelect}
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      width: "100%",
                      margin: "0.5rem",
                      backgroundColor: "white",
                      fontSize: "0.875rem"
                    }),
                    menuList: (provided) => ({
                      ...provided,
                      padding: 0,
                      margin: 0,
                      border: 0,
                      minWidth: minMenuWidth
                    }),
                    menu: (provided) => ({
                      ...provided,
                      padding: 0,
                      margin: 0,
                      border: 0,
                      minWidth: minMenuWidth,
                      borderTop: "1px solid #e2e8f0",
                      boxShadow: "none"
                    })
                  }}
                />
              </div>
            </PopoverPanel>,
            document.body
          )}
        </>
      )}
    </Popover>
  );
}
