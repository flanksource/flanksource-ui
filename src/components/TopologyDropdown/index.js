import React, { useCallback } from "react";
import AsyncSelect from "react-select/async";
import { components } from "react-select";
import { debounce } from "lodash";
import PropTypes from "prop-types";
import { Icon } from "../Icon";

const prepareTopologies = (topologies) =>
  topologies.map((topology) => ({
    ...topology,
    value: topology.id,
    label: topology.name
  }));

const ValueContainer = ({ children, ...props }) => {
  const { isMulti } = props;
  const { inputValue } = props?.selectProps || {};
  const { icon, status } = props?.selectProps?.value || {};

  return (
    <components.ValueContainer {...props}>
      <div className="flex items-center">
        {!isMulti && !inputValue && icon && (
          <Icon name={icon} size="xl" className="mr-1" />
        )}
        {children}
        {!isMulti && !inputValue && status && (
          <span className="bg-blue-200 px-2 rounded">{status}</span>
        )}
      </div>
    </components.ValueContainer>
  );
};

const Option = ({ children, ...props }) => {
  const { icon, status } = props?.data;
  return (
    <components.Option {...props}>
      <div className="flex w-full items-center">
        <Icon name={icon} size="xl" className="mr-2" />
        <div className="w-full"> {children}</div>
        <span className="bg-blue-200 px-2 rounded">{status}</span>
      </div>
    </components.Option>
  );
};

const MultiValueLabel = (props) => {
  const {
    data: { icon, status }
  } = props;
  return (
    <div className="flex p-1 items-center">
      <Icon name={icon} size="xl" />
      <components.MultiValueLabel {...props} />
      <span className="bg-blue-200 px-2 rounded ml-1 font-light text-sm">
        {status}
      </span>
    </div>
  );
};

export const TypologyDropdown = ({
  onSearch,
  onSelect,
  debounce: debounceTime,
  multiple,
  ...props
}) => {
  const handleSearch = useCallback(
    debounce((name, callback) => {
      onSearch(name).then((topologies) => {
        callback(prepareTopologies(topologies));
      });
    }, debounceTime),
    [onSearch]
  );

  return (
    <AsyncSelect
      cacheOptions
      isClearable
      loadOptions={handleSearch}
      placeholder="Input topology name..."
      components={{ ValueContainer, Option, MultiValueLabel }}
      onChange={onSelect}
      isMulti={multiple}
      {...props}
    />
  );
};

TypologyDropdown.propTypes = {
  onSearch: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  debounce: PropTypes.number,
  multiple: PropTypes.bool
};

TypologyDropdown.defaultProps = {
  debounce: 500,
  multiple: false
};
