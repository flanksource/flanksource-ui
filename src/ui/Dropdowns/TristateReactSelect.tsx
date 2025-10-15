import clsx from "clsx";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FaBan } from "react-icons/fa";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp
} from "react-icons/md";
import { DropdownIndicatorProps } from "react-select/dist/declarations/src/components/indicators";
import { Tooltip } from "react-tooltip";
import Select, {
  ControlProps,
  GroupBase,
  MultiValueProps,
  OptionProps,
  components
} from "react-windowed-select";
import { TristateToggle } from "../FormControls/TristateToggle";

export type TriStateOptions = {
  id: string;
  label: React.ReactNode;
  icon?: any;
  value: string;
  disabled?: boolean;
};

// We need to extend the Props interface from react-select to include the
// toggleState and setCurrenToggleState props. This is necessary to pass the
// toggle state to the custom Option component.
declare module "react-select/dist/declarations/src/Select" {
  export interface Props<
    Option,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    IsMulti extends boolean,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Group extends GroupBase<Option>
  > {
    toggleState?: TriStateToggleState;
    updateToggleState?: (key: string, value: string) => void;
  }
}

/**
 *
 * Takes a query param value that looks like this: key:1,key2:-1 and converts it
 * to key,!key2 that can be used in a query string to filter the results.
 *
 */
export function tristateOutputToQueryParamValue(
  param: string | undefined,
  encodeValue: boolean = false
) {
  return param
    ?.split(",")
    .map((type) => {
      const [changeType, symbol] = type.split(":");
      const symbolFilter = symbol?.toString() === "-1" ? "!" : "";
      const filterValue = changeType
        .replaceAll("____", ":")
        .replaceAll("||||", ",");
      if (encodeValue) {
        return encodeURIComponent(`${symbolFilter}${filterValue}`);
      }
      return `${symbolFilter}${filterValue}`;
    })
    .join(",");
}

/**
 *
 * Takes a tristate output (key:1,key2:-1) and converts it to a query filter param
 * that looks like this: &key.filter=key,!key2 that can be used in a query
 * string to filter the results.
 *
 */
export function tristateOutputToQueryFilterParam(
  param: string | undefined,
  key: string
) {
  if (param === undefined) {
    return "";
  }
  const paramValue = tristateOutputToQueryParamValue(param);
  return `&${key}.filter=${paramValue}`;
}

export function setTristateOutputToQueryFilterToURLSearchParam(
  searchParams: URLSearchParams,
  param: string | undefined,
  key: string
) {
  if (param === undefined) {
    return "";
  }
  const paramValue = tristateOutputToQueryParamValue(param);
  if (paramValue) {
    searchParams.set(`${key}.filter`, paramValue);
  }
}

type TriStateToggleState = {
  [key: string]: number;
};

type ReactSelectTriStateOptionsProps = OptionProps<TriStateOptions>;

function ReactSelectTriStateOptions({
  children,
  data,
  selectProps,
  clearValue,
  ...props
}: ReactSelectTriStateOptionsProps) {
  const { toggleState: currentToggleState = {}, updateToggleState = () => {} } =
    selectProps;

  const toggleValue = useMemo(
    () => currentToggleState[data.value!] || 0,
    [currentToggleState, data.value]
  );

  // If the option is disabled (like a separator), render without the toggle
  if (data.disabled) {
    return (
      <components.Option
        clearValue={clearValue}
        data={data}
        selectProps={selectProps}
        {...props}
      >
        <div className="w-full">{data.label || children}</div>
      </components.Option>
    );
  }

  return (
    <components.Option
      clearValue={clearValue}
      data={data}
      selectProps={selectProps}
      {...props}
    >
      <div className="flex min-w-min flex-row items-center gap-2 text-sm">
        <TristateToggle
          onChange={(value) => {
            updateToggleState(data.value!, value);
          }}
          value={toggleValue}
          label={undefined}
          hideLabel
          size="sm"
        />
        <div className="flex flex-1 flex-row gap-2 text-ellipsis whitespace-nowrap">
          {data.icon && <span>{data.icon}</span>}
          <div className="flex-1 text-ellipsis whitespace-nowrap">
            {data.label || children}
          </div>
        </div>
      </div>
    </components.Option>
  );
}

type ReactSelectTriStateMultiContainerProps = Pick<
  MultiValueProps<TriStateOptions>,
  "data" | "selectProps" | "getValue" | "children"
>;

function ReactSelectTriStateSingleValue({
  getValue
}: ReactSelectTriStateMultiContainerProps) {
  const value = getValue?.();

  const totalIncluded = useMemo(
    () =>
      value.filter((v) => {
        const [, value] = v.value.split(":");
        return +value === 1;
      }),
    [value]
  );

  const totalExcluded = useMemo(
    () =>
      value.filter((v) => {
        const [, value] = v.value.split(":");
        return +value === -1;
      }),
    [value]
  );

  return (
    <div className="flex flex-row gap-1 overflow-hidden text-ellipsis rounded-md text-xs">
      {value.length < 4 ? (
        value.map((v) => {
          const [, value] = v.value.split(":");
          return (
            <>
              <div
                data-tooltip-id={`item-${v.id}`}
                data-tooltip-content={`${
                  +value === 1 ? "Include" : "Exclude"
                } ${v.label}`}
                key={v.id}
                className={clsx(
                  "flex w-auto max-w-full flex-row items-center gap-1 overflow-hidden text-ellipsis text-nowrap bg-gray-200 px-2 py-1"
                )}
              >
                <span className="flex-1 overflow-hidden text-ellipsis text-nowrap">
                  {v.label}
                </span>{" "}
                <span> {+value === 1 ? "" : <FaBan />}</span>
              </div>
              <Tooltip id={`item-${v.id}`} />
            </>
          );
        })
      ) : (
        <span className="flex flex-row space-x-1 text-xs">
          {totalIncluded.length > 0 && (
            <div className="flex w-auto max-w-full flex-row items-center gap-1 overflow-hidden text-ellipsis text-nowrap bg-gray-200 px-2 py-1">
              <span className="flex-1 overflow-hidden text-ellipsis text-nowrap">
                {totalIncluded.length} Items
              </span>
            </div>
          )}
          {totalExcluded.length > 0 && (
            <div className="flex w-auto max-w-full flex-row items-center gap-1 overflow-hidden text-ellipsis text-nowrap bg-gray-200 px-2 py-1">
              <span className="flex-1 overflow-hidden text-ellipsis text-nowrap">
                {totalExcluded.length} Items
              </span>
              <FaBan />
            </div>
          )}
        </span>
      )}
    </div>
  );
}

function TriStateCustomDropdownIndicator(
  props: DropdownIndicatorProps<TriStateOptions>
) {
  return (
    <components.DropdownIndicator {...props}>
      {props.isFocused ? (
        <MdOutlineKeyboardArrowUp className="text-black" />
      ) : (
        <MdOutlineKeyboardArrowDown className="text-black" />
      )}
    </components.DropdownIndicator>
  );
}

function TriStateCustomControlContainer({
  children,
  ...props
}: ControlProps<TriStateOptions>) {
  return (
    <components.Control {...props}>
      <div className="flex min-h-[35px] w-full max-w-full flex-row items-center overflow-hidden text-nowrap px-2 text-sm text-gray-600">
        <div className="text-xs text-gray-500">
          {props.selectProps.placeholder}:
        </div>
        <div className="flex max-w-full flex-1 flex-row overflow-hidden">
          {children}
        </div>
      </div>
    </components.Control>
  );
}

type TristateReactSelectProps = {
  options: TriStateOptions[];
  isLoading?: boolean;
  onChange?: (value?: string) => void;
  value?: string;
  label: string;
  className?: string;
  isTagsDropdown?: boolean;
  minMenuWidth?: string;
};

export function TristateReactSelectComponent({
  options,
  isLoading = false,
  onChange = () => {},
  value,
  label,
  className = "w-auto max-w-80",
  isTagsDropdown = false,
  minMenuWidth = "100% !important"
}: TristateReactSelectProps) {
  const [currentToggleState, setToggleState] = useState<TriStateToggleState>(
    () => {
      if (value) {
        return value.split(",").reduce((acc, item) => {
          const [key, value] = item.split(":");
          return {
            ...acc,
            [key]: parseInt(value, 10)
          };
        }, {});
      }
      return {};
    }
  );

  useEffect(() => {
    if (value) {
      setToggleState(
        value.split(",").reduce((acc, item) => {
          const [key, value] = item.split(":");
          return {
            ...acc,
            [key]: parseInt(value, 10)
          };
        }, {})
      );
    } else {
      setToggleState({});
    }
  }, [value]);

  // When the toggle state changes, update the value, which is a string of comma-separated key:value pairs
  useEffect(() => {
    const newChangeValue = Object.entries(currentToggleState).reduce(
      (acc, [key, value]) => {
        if (acc === "") {
          return `${key}:${value}`;
        }
        return `${acc},${key}:${value}`;
      },
      ""
    );

    onChange(newChangeValue === "" ? undefined : newChangeValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentToggleState]);

  const selectedItems = useMemo(() => {
    if (value === undefined) {
      return [];
    }
    // We have no options, so we return an empty array, and re-compute the value
    // when the options are available
    if (options.length === 0) {
      return [];
    }
    return Object.entries(currentToggleState).map(([key, value]) => {
      const option = options.find((x) => x.value === key)!;
      return {
        ...option,
        value: `${key}:${value}`
      } satisfies TriStateOptions;
    });
  }, [currentToggleState, options, value]);

  const sortOptionsFunction = useCallback(
    (options: TriStateOptions[]) => {
      if (selectedItems.length === 0) {
        return options;
      }
      return options.sort((a: TriStateOptions, b: TriStateOptions) => {
        // if a is selected, it should be first, if b is selected, it should be
        // first
        if (selectedItems.find((x) => x.label === a.label)) {
          return -1;
        }
        if (selectedItems.find((x) => x.label === b.label)) {
          return 1;
        }
        return 0;
      });
    },
    [selectedItems]
  );

  // We are using state to store the sorted options, so that we can re-sort when
  // the menu is closed, which leds to a much better UX, as compared to sorting
  // as the user is selecting, as this may lead to layout shifts.
  const [sortOptionsSelectedFirst, setSortOptionsSelectedFirst] = useState(() =>
    sortOptionsFunction(options)
  );

  // For async options, we need to re-sort the options when the options become
  // available, so we use a useEffect to do that.
  useEffect(() => {
    if (options.length > 0 && sortOptionsSelectedFirst.length === 0) {
      setSortOptionsSelectedFirst(() => sortOptionsFunction(options));
    }
  }, [options, sortOptionsFunction, sortOptionsSelectedFirst.length, value]);

  const onItemToggle = useCallback(
    (key: string, value: string) => {
      setToggleState((prev) => {
        if (+value === 0) {
          return {
            ...Object.entries(prev)
              .filter(([k, v]) => k !== key)
              .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {})
          };
        }
        if (isTagsDropdown) {
          // We don't reset the values if it's a tags dropdown, but same tag
          // shouldn't be included and excluded at the same time.
          return {
            ...Object.entries(prev)
              .filter(([k, v]) => {
                const tagKey = k.split("____")[0];
                if (tagKey === key.split("____")[0]) {
                  // if value is different,remove the value else keep it
                  if (v !== +value) {
                    return false;
                  }
                }
                return true;
              })
              .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {}),
            [key]: +value
          };
        }
        return {
          // Reset all other values to 0 that don't have same value, and set the
          // current value to the
          ...Object.entries(prev)
            .filter(([, v]) => v === +value)
            .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {}),
          [key]: +value
        };
      });
    },
    [isTagsDropdown]
  );

  return (
    <Select
      placeholder={label}
      hideSelectedOptions
      className={className}
      // Sort the options so that the selected items are first
      onMenuOpen={() =>
        setSortOptionsSelectedFirst(() => sortOptionsFunction(options))
      }
      onChange={(value: any, options) => {
        // At this point, this event is only triggered when the user selects an
        // option, instead of when the toggle state changes, so we need to
        // update the toggle state here.
        if (value === null) {
          return;
        }
        onItemToggle(value.value, "1");
      }}
      menuPortalTarget={document.body}
      menuPosition={"fixed"}
      menuShouldBlockScroll={true}
      closeMenuOnSelect={false}
      value={selectedItems}
      onMenuClose={() =>
        setSortOptionsSelectedFirst(() => sortOptionsFunction(options))
      }
      styles={{
        menu: (baseStyles) => ({
          ...baseStyles,
          width: "min-content !important",
          minWidth: minMenuWidth,
          maxWidth: "800px !important"
        }),
        valueContainer: (baseStyles) => ({
          ...baseStyles,
          display: "flex",
          flexDirection: "row",
          flexWrap: "nowrap"
        }),
        control: (base) => ({
          ...base,
          display: "flex",
          flexDirection: "column"
        })
      }}
      options={sortOptionsSelectedFirst}
      isLoading={isLoading}
      isOptionDisabled={(option) =>
        (option as TriStateOptions).disabled === true
      }
      components={{
        // React.memo here is a hack, force the component to re-render when the
        // toggle state changes from other options or parent components, which
        // is not ideal, but it works for now.
        // @ts-expect-error
        Option: React.memo(ReactSelectTriStateOptions),
        // @ts-expect-error
        SingleValue: ReactSelectTriStateSingleValue,
        // @ts-expect-error
        DropdownIndicator: TriStateCustomDropdownIndicator,
        IndicatorSeparator: () => null,
        // @ts-expect-error
        Control: TriStateCustomControlContainer,
        Placeholder: () => <>None</>
      }}
      // Pass the toggle state and the setter to the custom Option component
      toggleState={currentToggleState}
      updateToggleState={onItemToggle}
      isTagsDropdown={isTagsDropdown}
    />
  );
}

const TristateReactSelect = React.memo(TristateReactSelectComponent);

export default TristateReactSelect;
