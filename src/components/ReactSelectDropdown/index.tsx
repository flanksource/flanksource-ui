import clsx from "clsx";
import {
  FunctionComponent,
  ReactNode,
  Ref,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { Control, Controller } from "react-hook-form";

import Select, { SingleValue, StylesConfig } from "react-select";
import { defaultTheme, components } from "react-select";
import { Avatar } from "../Avatar";

const { colors } = defaultTheme;

interface StateOption {
  label?: string;
  value?: string;
  icon?: any;
  description?: string;
  order?: number;
  avatar?: any;
}

const selectStyles: StylesConfig<StateOption, false> = {
  control: (provided) => ({
    ...provided,
    minWidth: 240,
    margin: 8
  }),
  menu: () => ({ boxShadow: "inset 0 1px 0 rgba(0, 0, 0, 0.1)" })
};

type ReactSelectDropdownProps = {
  className?: string;
  label?: string;
  control?: any;
  items?:
    | {
        [key: string]: StateOption;
      }
    | StateOption[];
  name: string;
  onChange?: () => void;
  value?: StateOption;
  placeholder?: string;
  prefix?: ReactNode;
  labelClass?: string;
};

export const ReactSelectDropdown = ({
  className,
  label,
  control,
  items,
  name,
  onChange = () => {},
  value,
  prefix,
  labelClass,
  placeholder
}: ReactSelectDropdownProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [options, setOptions] = useState<StateOption[]>([]);
  const ref = useRef<HTMLDivElement>();

  useEffect(() => {
    if (!items) {
      return;
    }
    const data: any[] = [];
    Object.keys(items).forEach((key: string) => {
      const item: any = items[key];
      item.label = item.label || item.description;
      item.description = item.description || item.label;
      item.order = item.order || 0;
      data.push(item);
    });
    data.sort((v1, v2) => v1.order - v2.order);
    setOptions(data);
  }, [items]);

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (!ref?.current?.contains(event.target as Node)) {
        setIsOpen(false);
        return;
      }
    };
    document.addEventListener("click", listener);
    return () => {
      document.removeEventListener("click", listener);
    };
  }, []);

  const SelectedOption = useMemo(() => {
    return options.find((option) => option.value === value);
  }, [options, value]);

  const toggleOpen = () => {
    setIsOpen((val) => !val);
  };

  const onSelectChange = (value: SingleValue<StateOption | undefined>) => {
    toggleOpen();
    onChange(value?.value);
  };

  return (
    <Dropdown
      isOpen={isOpen}
      onClose={toggleOpen}
      inputRef={ref}
      target={
        <div className={label ? "space-y-2" : ""}>
          <label
            className={
              labelClass
                ? labelClass
                : "text-sm font-medium text-gray-700 block"
            }
          >
            {label}
          </label>
          <div
            className={clsx(
              `relative cursor-pointer h-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left  focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                ${SelectedOption?.id === "_empty" && "text-gray-400"}
              `,
              className
            )}
            onClick={toggleOpen}
          >
            <div className="flex items-center">
              {prefix}
              {SelectedOption?.icon && <div>{SelectedOption.icon}</div>}
              <span className="ml-2 block truncate">
                {SelectedOption?.description}
              </span>
            </div>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </span>
          </div>
        </div>
      }
    >
      {control ? (
        <Controller
          control={control}
          name={name}
          render={({ field }) => {
            const { onChange: onChangeControlled, value: valueControlled } =
              field;
            return (
              <Select
                autoFocus
                backspaceRemovesValue={false}
                components={{
                  DropdownIndicator,
                  IndicatorSeparator: null,
                  Option: (props: any) => {
                    return (
                      <components.Option {...props}>
                        <div className="flex items-center">
                          {props.data.avatar && (
                            <Avatar user={props.data} size="sm" />
                          )}
                          {props.data.icon && <div>{props.data.icon}</div>}
                          <span
                            className={clsx(
                              props.data.value === value
                                ? "font-semibold"
                                : "font-normal",
                              "ml-2 block truncate"
                            )}
                          >
                            {props.data.description}
                          </span>
                        </div>
                      </components.Option>
                    );
                  }
                }}
                controlShouldRenderValue={false}
                hideSelectedOptions={false}
                isClearable={false}
                menuIsOpen
                onChange={(e) => {
                  onChangeControlled(e.value);
                  onSelectChange(e.value);
                }}
                options={options}
                placeholder="Search..."
                styles={selectStyles}
                tabSelectsValue={false}
                value={valueControlled}
                getOptionValue={(option: any) => option.value}
              />
            );
          }}
        />
      ) : (
        <Select
          autoFocus
          backspaceRemovesValue={false}
          components={{
            DropdownIndicator,
            IndicatorSeparator: null,
            Option: (props: any) => {
              return (
                <components.Option {...props}>
                  <div className="flex items-center">
                    {props.data.avatar && (
                      <Avatar user={props.data} size="sm" />
                    )}
                    {props.data.icon && <div>{props.data.icon}</div>}
                    <span
                      className={clsx(
                        props.data.value === value
                          ? "font-semibold"
                          : "font-normal",
                        "ml-2 block truncate"
                      )}
                    >
                      {props.data.description}
                    </span>
                  </div>
                </components.Option>
              );
            }
          }}
          controlShouldRenderValue={false}
          hideSelectedOptions={false}
          isClearable={false}
          menuIsOpen
          onChange={onSelectChange}
          options={options}
          placeholder="Search..."
          styles={selectStyles}
          tabSelectsValue={false}
          value={value}
          getOptionValue={(option: any) => option.value}
        />
      )}
    </Dropdown>
  );
};

// styled components

const Menu = (props: JSX.IntrinsicElements["div"]) => {
  const shadow = "hsla(218, 50%, 10%, 0.1)";
  return (
    <div
      css={{
        backgroundColor: "white",
        borderRadius: 4,
        boxShadow: `0 0 0 1px ${shadow}, 0 4px 11px ${shadow}`,
        marginTop: 8,
        position: "absolute",
        zIndex: 2
      }}
      {...props}
    />
  );
};
const Blanket = (props: JSX.IntrinsicElements["div"]) => (
  <div
    css={{
      bottom: 0,
      left: 0,
      top: 0,
      right: 0,
      position: "fixed",
      zIndex: 1
    }}
    {...props}
  />
);
interface DropdownProps {
  readonly isOpen: boolean;
  readonly target: ReactNode;
  readonly onClose: () => void;
  readonly inputRef: Ref<HTMLDivElement>;
}
const Dropdown: FunctionComponent<DropdownProps> = ({
  children,
  isOpen,
  target,
  inputRef,
  onClose
}) => (
  <div ref={inputRef} className="relative">
    {target}
    {isOpen ? (
      <Menu className="absolute bg-white z-50 drop-shadow-md">{children}</Menu>
    ) : null}
    {isOpen ? <Blanket onClick={onClose} /> : null}
  </div>
);
const Svg = (p: JSX.IntrinsicElements["svg"]) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    focusable="false"
    role="presentation"
    {...p}
  />
);
const DropdownIndicator = () => (
  <div css={{ color: colors.neutral20, height: 24, width: 32 }}>
    <Svg>
      <path
        d="M16.436 15.085l3.94 4.01a1 1 0 0 1-1.425 1.402l-3.938-4.006a7.5 7.5 0 1 1 1.423-1.406zM10.5 16a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </Svg>
  </div>
);
const ChevronDown = ({ className }: { className: string }) => (
  <Svg
    className={clsx("inline-block float-right", className)}
    style={{ marginRight: -6 }}
  >
    <path
      d="M8.292 10.293a1.009 1.009 0 0 0 0 1.419l2.939 2.965c.218.215.5.322.779.322s.556-.107.769-.322l2.93-2.955a1.01 1.01 0 0 0 0-1.419.987.987 0 0 0-1.406 0l-2.298 2.317-2.307-2.327a.99.99 0 0 0-1.406 0z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </Svg>
);
