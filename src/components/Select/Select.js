import React from "react";
import ReactSelect, { components } from "react-select";
import PropTypes from "prop-types";
import { Controller } from "react-hook-form";

const SelectAllFeatureValueContainer = ({ children, ...props }) => {
  const currentValues = props.getValue();
  let toBeRendered = children;

  if (
    currentValues.some(
      (val) => val.value === props.selectProps.allOption?.value
    )
  ) {
    toBeRendered = React.Children.toArray(children).filter(
      (c) =>
        !c.props.data ||
        c.props.data.value !== props.selectProps.allOption?.value
    );
  }

  return (
    <components.ValueContainer {...props}>
      {toBeRendered}
    </components.ValueContainer>
  );
};

const selectAllOptionFeatureDecorator = (originalProps) => {
  const {
    allowSelectAll,
    allOption,
    onChange: initialOnChange,
    options,
    value
  } = originalProps;

  if (!allowSelectAll) {
    return {};
  }

  const isAllOptionSelected = value?.length === options.length;

  const fullOptions = [allOption, ...options];

  const onChange = (newValue, actionMeta) => {
    const { action, option, removedValue } = actionMeta;

    switch (action) {
      case "select-option": {
        if (option.value === allOption.value) {
          return initialOnChange(options, actionMeta);
        }
        return initialOnChange(newValue || [], actionMeta);
      }
      case "deselect-option": {
        if (option.value === allOption.value) {
          return initialOnChange([], actionMeta);
        }
        if (isAllOptionSelected) {
          return initialOnChange(
            options.filter(({ value }) => value !== option.value),
            actionMeta
          );
        }
        return initialOnChange(newValue || [], actionMeta);
      }
      case "remove-value": {
        if (removedValue.value === allOption.value) {
          return initialOnChange([], actionMeta);
        }
        if (isAllOptionSelected) {
          return initialOnChange(
            options.filter(({ value }) => value !== removedValue.value),
            actionMeta
          );
        }
        return initialOnChange(newValue || [], actionMeta);
      }
      default:
        return initialOnChange(newValue || [], actionMeta);
    }
  };

  return {
    onChange,
    options: fullOptions,
    value: isAllOptionSelected ? [allOption, ...value] : value,
    components: {
      ...originalProps.components,
      ValueContainer: SelectAllFeatureValueContainer
    }
  };
};

const selectColourStyles = {
  control: (styles, { isFocused }) => {
    return {
      ...styles,
      minHeight: "42px",
      border: "1px solid #D1D5DB",
      borderColor: isFocused ? "#6366F1" : undefined,
      boxShadow: isFocused
        ? "0px 0px 0px 2px rgba(99, 102, 241, 1), 0px 1px 2px 0px rgba(0, 0, 0, 0.05)"
        : "0px 1px 2px rgba(0, 0, 0, 0.05)",
      borderRadius: "6px",
      "&:hover": {
        ...styles["&:hover"],
        borderColor: undefined,
        boxShadow: undefined
      }
    };
  },
  option: (styles, { isSelected, isFocused }) => ({
    ...styles,
    backgroundColor: isSelected ? "#4e45df" : isFocused ? "#e6e4fa" : undefined,
    ":active": {
      ...styles[":active"],
      backgroundColor: "#ccc9f6"
    }
  }),
  indicatorSeparator: (styles) => ({
    ...styles,
    backgroundColor: "#9CA3AF"
  }),
  dropdownIndicator: (styles) => ({
    ...styles,
    color: "#9CA3AF"
  }),
  clearIndicator: (styles) => ({
    ...styles,
    color: "#9CA3AF"
  }),
  menu: (styles) => ({
    ...styles,
    borderRadius: "6px",
    boxShadow:
      "0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05), 0px 0px 0px 1px rgba(0, 0, 0, 0.05)"
  }),
  singleValue: (styles) => ({
    ...styles,
    fontSize: "16px",
    lineHeight: "24px"
  }),
  input: (styles) => ({
    ...styles,
    "& input:focus": {
      boxShadow: "none"
    }
  })
};

export const Select = (props) => {
  const { name, control, styles } = props;
  if (control) {
    return (
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value, ref, name } }) => {
          const composedProps = {
            ...props,
            inputRef: ref,
            name,
            value: props.isMulti
              ? props.options.filter((o) => value?.includes(o.value))
              : props.options.find((o) => o.value === value),
            onChange: props.isMulti
              ? (value) => onChange(value.map((i) => i.value))
              : (value) => onChange(value?.value),
            styles: { ...selectColourStyles, ...(props.styles || {}) }
          };
          const selectAllProps = selectAllOptionFeatureDecorator(composedProps);
          return <ReactSelect {...composedProps} {...selectAllProps} />;
        }}
      />
    );
  }
  const composedProps = {
    ...props,
    styles: { ...selectColourStyles, ...(styles || {}) }
  };
  const selectAllProps = selectAllOptionFeatureDecorator(composedProps);

  return <ReactSelect {...composedProps} {...selectAllProps} />;
};

Select.propTypes = {
  // eslint-disable-next-line react/require-default-props
  options: PropTypes.arrayOf(PropTypes.any),
  // eslint-disable-next-line react/forbid-prop-types,react/require-default-props
  allowSelectAll: PropTypes.bool,
  allOption: PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string
  }),
  control: PropTypes.shape({}),
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  value: PropTypes.any
};

Select.defaultProps = {
  allOption: {
    label: "Select all",
    value: "*"
  },
  allowSelectAll: false,
  onChange: () => {},
  control: undefined,
  value: undefined
};

export { components };
