import clsx from "clsx";
import {
  FunctionComponent,
  ReactNode,
  useEffect,
  useMemo,
  useState
} from "react";
import { Controller } from "react-hook-form";

import Select, { SingleValue, StylesConfig } from "react-select";
import { defaultTheme } from "react-select";

const { colors } = defaultTheme;

interface StateOption {
  label?: string;
  value?: string;
  icon?: any;
  description?: string;
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
  items?: {
    [key: string]: StateOption;
  };
  name: string;
  onChange?: () => void;
  value?: StateOption;
  placeholder?: string;
  prefix: ReactNode;
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
  placeholder
}: ReactSelectDropdownProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [options, setOptions] = useState<StateOption[]>([]);

  useEffect(() => {
    if (!items) {
      return;
    }
    const data: any[] = [];
    Object.keys(items).forEach((key: string) => {
      const item = items[key];
      item.label = items[key].description;
      data.push(items[key]);
    });
    setOptions(data);
  }, [items]);

  const OptionIcon = useMemo(() => {
    return options.find((option) => option.value === value)?.icon;
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
      target={
        <div
          onClick={toggleOpen}
          className={clsx(
            "rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
            className
          )}
        >
          <div className="inline-block">{prefix}</div>
          <div className="inline-block">
            {OptionIcon && (
              <span className="inline-block mr-2">{OptionIcon}</span>
            )}
            <span className="inline-block">{value}</span>
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
                components={{ DropdownIndicator, IndicatorSeparator: null }}
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
          components={{ DropdownIndicator, IndicatorSeparator: null }}
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
}
const Dropdown: FunctionComponent<DropdownProps> = ({
  children,
  isOpen,
  target,
  onClose
}) => (
  <div css={{ position: "relative" }}>
    {target}
    {isOpen ? <Menu className="absolute bg-white">{children}</Menu> : null}
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
const ChevronDown = () => (
  <Svg style={{ marginRight: -6 }}>
    <path
      d="M8.292 10.293a1.009 1.009 0 0 0 0 1.419l2.939 2.965c.218.215.5.322.779.322s.556-.107.769-.322l2.93-2.955a1.01 1.01 0 0 0 0-1.419.987.987 0 0 0-1.406 0l-2.298 2.317-2.307-2.327a.99.99 0 0 0-1.406 0z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </Svg>
);
